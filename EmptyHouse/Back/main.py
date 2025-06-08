import os
import uuid
import sqlite3
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models.db_job import Job
from database import SessionLocal
from services.gaussian_splat import save_uploaded_file, zip_folder, send_zip_to_colab
from database import engine, Base
from api.routes_auth import router as auth_router
from api import routes_property
from routes import house
from sqlalchemy import text, Boolean
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import pandas as pd

# --- 서버 시작 시 빈집 데이터 캐시 ---
cached_house_data = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    global cached_house_data
    try:
        df = pd.read_csv("data/군산빈집_latlng.csv")
        df = df.rename(columns={"위도": "lat", "경도": "lng", "전체주소": "address"})
        
        df["lat"] = pd.to_numeric(df["lat"], errors="coerce")
        df["lng"] = pd.to_numeric(df["lng"], errors="coerce")
        df = df.dropna(subset=["lat", "lng"])
        
        df = df.fillna("")
        cached_house_data = df.to_dict(orient="records")
        print(f"빈집 데이터 {len(cached_house_data)}건 캐싱 완료")
    except Exception as e:
        print(f"빈집 데이터 로딩 실패: {e}")
    
    yield  # 애플리케이션 실행 유지

#  lifespan 핸들러를 적용한 FastAPI 인스턴스 생성
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 회원가입/로그인용 모델 ---
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

DB_PATH = os.path.join(os.path.dirname(__file__), "users.db")

@app.post("/signup")
def signup(user: UserCreate):
    print("회원가입 시도:", user.email, DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            hashed_password TEXT NOT NULL
        )
    ''')
    cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")
    cursor.execute(
        "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
        (user.email, user.password)
    )
    conn.commit()
    conn.close()
    return {"message": "회원가입 성공!"}

# --------- [로그인 엔드포인트] ---------
@app.post("/login")
def login(user: UserLogin):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, email FROM users WHERE email = ? AND hashed_password = ?",
        (user.email, user.password)
    )
    row = cursor.fetchone()
    conn.close()
    if row:
        return {
            "success": True,
            "user_id": row[0],
            "email": row[1]
        }
    else:
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 일치하지 않습니다.")

@app.post("/upload_images")
async def upload_images(
    files: List[UploadFile] = File(...),
    email: str = Form(...)  # 프론트에서 email 폼필드로 받는 방식 유지
):
    user_dir = os.path.join("images", email)
    job_uuid = str(uuid.uuid4())
    uuid_dir = os.path.join(user_dir, job_uuid)
    os.makedirs(uuid_dir, exist_ok=True)

    saved_paths = []
    for file in files:
        file_path = os.path.join(uuid_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        saved_paths.append(file_path)

    # --- email로 user_id 찾기 ---
    db = SessionLocal()
    user = db.execute(text("SELECT id FROM users WHERE email = :email"), {"email": email}).fetchone()
    if not user:
        db.close()
        raise HTTPException(status_code=400, detail="해당 이메일을 가진 사용자가 존재하지 않습니다.")
    user_id = user[0]

    # --- user_id 넣어서 Job 생성 ---
    job = Job(
        user_id=user_id,        # 이제 실제 유저 id!
        job_uuid=job_uuid,
        result_path="",
        status="uploaded"
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    db.close()

    # zip 파일 생성
    zip_path = zip_folder(uuid_dir)
    send_zip_to_colab(zip_path, email, job_uuid)

    return {
        "folder": uuid_dir,
        "zip_path": zip_path,
        "saved_files": saved_paths,
        "job_uuid": job_uuid
    }

@app.post("/register_result")
async def register_result(
    job_uuid: str = Form(...),
    result_path: str = Form(None),
    result_file: UploadFile = File(None)
):
    print(f"=== register_result 호출됨: job_uuid={job_uuid}, result_path={result_path}, result_file={result_file.filename if result_file else None}")
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.job_uuid == job_uuid).first()
        if not job:
            db.close()
            print("❌ Job not found")
            raise HTTPException(status_code=404, detail="Job not found")
        
        # 파일 업로드 방식 지원
        if result_file:
            save_dir = "outputs/"
            os.makedirs(save_dir, exist_ok=True)
            save_path = os.path.join(save_dir, f"{job_uuid}_{result_file.filename}")
            with open(save_path, "wb") as f:
                f.write(await result_file.read())
            rel_path = os.path.relpath(save_path, '.')  # 상대경로
            job.result_path = rel_path.replace("\\", "/")  # 윈도우 슬래시 호환
            job.status = "done"

        # 경로 전달 방식
        elif result_path:
            job.result_path = result_path
            job.status = "done"
        else:
            db.close()
            print("❌ No result_file or result_path provided")
            raise HTTPException(status_code=400, detail="No result_file or result_path provided")
        db.commit()
        print("✅ DB 커밋 성공")
        return {"success": True, "job_id": job.id, "result_path": job.result_path}
    finally:
        db.close()

@app.get("/my_jobs/{email}")
def my_jobs(email: str):
    db = SessionLocal()
    try:
        user = db.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": email}
        ).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user[0]
        jobs = db.query(Job).filter(Job.user_id == user_id).order_by(Job.created_at.desc()).all()
        job_list = [
            {
                "job_uuid": j.job_uuid,
                "result_path": j.result_path,
                "status": j.status,
                "created_at": j.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            }
            for j in jobs
        ]
        return job_list
    finally:
        db.close()

@app.get("/job_detail/{job_uuid}")
def job_detail(job_uuid: str):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.job_uuid == job_uuid).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return {
            "job_uuid": job.job_uuid,
            "result_path": job.result_path,
            "status": job.status,
            "created_at": job.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
    finally:
        db.close()

app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

@app.get("/outputs_download/{filename:path}")
def download_ply(filename: str):
    ply_path = os.path.join("outputs", filename)
    abs_path = os.path.abspath(ply_path)
    if not abs_path.startswith(os.path.abspath("outputs")):
        raise HTTPException(status_code=403, detail="Invalid path")
    return FileResponse(
        abs_path,
        media_type="application/octet-stream",
        filename=os.path.basename(filename),
        headers={
            "Access-Control-Allow-Origin": "*",
            "Content-Disposition": f'attachment; filename="{os.path.basename(filename)}"'
        }
    )

@app.post("/publish_job/{job_uuid}")
def publish_job(job_uuid: str):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.job_uuid == job_uuid).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        job.is_published = True
        db.commit()
        return {"success": True, "message": "이 작업이 메인페이지에 공개되었습니다."}
    finally:
        db.close()


@app.get("/published_jobs")
def published_jobs():
    db = SessionLocal()
    try:
        jobs = (
            db.query(Job)
            .filter(Job.is_published == True, Job.status == "done")  # 완료된 것만!
            .order_by(Job.created_at.desc())
            .all()
        )
        # 실제 데이터에 맞게 필드명은 수정 가능!
        return [
            {
                "id": j.job_uuid,
                "image": f"http://localhost:8000/outputs_download/{j.result_path.replace('outputs/', '')}" if j.result_path else "",
                "title": f"작업번호 {j.job_uuid}",
                "tags": ["공개"],  # 필요하면 Job에 태그 추가해서 사용
                "status": j.status,
                "created_at": j.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            }
            for j in jobs
        ]
    finally:
        db.close()
        
@app.get("/houses")
def get_houses():
    return cached_house_data


# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(auth_router)
app.include_router(routes_property.router)
app.include_router(house.router)