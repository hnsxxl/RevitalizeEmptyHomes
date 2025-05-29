from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from services.gaussian_splat import save_uploaded_file, send_to_colab
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

@app.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    saved_path = save_uploaded_file(file, "images")
    result_path = send_to_colab(saved_path)
    return {"saved_path": saved_path}

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(auth_router)
app.include_router(routes_property.router)
app.include_router(house.router)