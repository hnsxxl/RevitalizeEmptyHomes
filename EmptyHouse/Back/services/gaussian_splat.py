import shutil
import os
from fastapi import UploadFile
import requests
import zipfile

def save_uploaded_file(upload_file, save_dir: str) -> str:
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, upload_file.filename)
    with open(save_path, "wb") as buffer:
        buffer.write(upload_file.file.read())
    return save_path

def zip_folder(folder_path: str) -> str:
    zip_path = folder_path + ".zip"
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, folder_path)
                zipf.write(abs_path, arcname=rel_path)
    return zip_path

def send_zip_to_colab(zip_path: str, email: str, job_uuid: str):
    colab_api_url = "https://01cd-34-125-203-53.ngrok-free.app/process" 
    try:
        with open(zip_path, "rb") as zip_file:
            files = {"file": zip_file}
            # 👇 email과 job_uuid 둘 다 반드시 포함!
            data = {"email": email, "job_uuid": job_uuid}
            response = requests.post(colab_api_url, files=files, data=data, timeout=120)
        print("Colab 응답 status:", response.status_code)
        print("Colab 응답 내용:", response.text)
        return response
    except Exception as e:
        print("Colab 전송 중 에러 발생:", e)
        return None