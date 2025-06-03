from database import SessionLocal
from models.db_user import User   
from models.db_job import Job

# 1. 세션 열기
db = SessionLocal()

# 2. INSERT 테스트
job = Job(
    user_id=1,                            # users 테이블에 있는 user_id여야 함!
    job_uuid="example-uuid-001",
    result_path="output/example.ply",
    status="running"
)
db.add(job)
db.commit()
db.refresh(job)
print("INSERT:", job)

# 3. SELECT 테스트 (모든 jobs 불러오기)
jobs = db.query(Job).all()
print("\nALL JOBS:")
for j in jobs:
    print(j)

# 4. SELECT: 특정 user_id만 조회
user_jobs = db.query(Job).filter(Job.user_id == 1).all()
print("\nUSER 1 JOBS:")
for j in user_jobs:
    print(j)

db.close()