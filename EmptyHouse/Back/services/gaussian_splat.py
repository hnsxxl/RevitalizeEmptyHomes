import shutil
import os
from fastapi import UploadFile
import requests



def save_uploaded_file(upload_file: UploadFile, save_dir: str) -> str:
    os.makedirs(save_dir, exist_ok=True)
    save_path = f"{save_dir}/{upload_file.filename}"
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    return save_path

def send_to_colab(img_path):
    colab_api_url = "https://3818-34-105-120-85.ngrok-free.app/process"
    try:
        with open(img_path, "rb") as img_file:
            files = {"file": img_file}
            response = requests.post(colab_api_url, files=files, timeout=10)
        print("Colab 응답 status:", response.status_code)
        print("Colab 응답 내용:", response.headers)

        os.makedirs("results", exist_ok=True)

        with open("results/result.jpg", "wb") as f:
            f.write(response.content)
        return "results/result.jpg"
    except Exception as e:
        print("Colab 전송 중 에러 발생:", e)
        return None