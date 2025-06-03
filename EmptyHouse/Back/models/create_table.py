import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import engine, Base
from models.db_user import User     # 반드시 import (users 테이블 FK 때문!)
from models.db_house import House   # houses 테이블도 필요하면 import
from models.db_job import Job

# 이미 존재하는 테이블(users, houses)은 그대로 두고,
# jobs만 새로 생성
Base.metadata.create_all(bind=engine)
print("jobs 테이블이 정상적으로 추가됨!")