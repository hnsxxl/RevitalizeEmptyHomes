from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from database import get_db
from models.db_user import User
from services.auth_service import create_access_token, hash_password, verify_password

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 가입된 이메일입니다.")

    hashed_pw = hash_password(user.password)
    new_user = User(email=user.email, hashed_password=hashed_pw)

    db.add(new_user)
    db.commit()
    return {"msg": "회원가입 성공"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="비밀번호가 일치하지 않습니다.")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
