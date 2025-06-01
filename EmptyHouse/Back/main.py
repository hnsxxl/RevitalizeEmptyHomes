import os
import uuid
import sqlite3
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.gaussian_splat import save_uploaded_file, zip_folder, send_zip_to_colab
from database import engine, Base
from api.routes_auth import router as auth_router
from api import routes_property
from routes import house

app = FastAPI()

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

DB_PATH = "C:/Users/user/Desktop/Project/RevitalizeEmptyHomes1/EmptyHouse/Back/users.db"

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
        "SELECT id FROM users WHERE email = ? AND hashed_password = ?",
        (user.email, user.password)
    )
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"success": True, "user_id": row[0]}
    else:
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 일치하지 않습니다.")

@app.post("/upload_images")
async def upload_images(
    files: List[UploadFile] = File(...),
    email: str = Form(...)
):
    user_dir = os.path.join("images", email)
    uuid_dir = os.path.join(user_dir, str(uuid.uuid4()))
    os.makedirs(uuid_dir, exist_ok=True)

    saved_paths = []
    for file in files:
        file_path = os.path.join(uuid_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        saved_paths.append(file_path)

    zip_path = zip_folder(uuid_dir)
    send_zip_to_colab(zip_path, email)

    return {"folder": uuid_dir, "zip_path": zip_path, "saved_files": saved_paths}

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(auth_router)
app.include_router(routes_property.router)
app.include_router(house.router)