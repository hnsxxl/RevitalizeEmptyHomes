from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from database import Base          # Back/database.py에서 import!
import datetime

class Job(Base):
    __tablename__ = 'jobs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # users.id와 FK 연결
    job_uuid = Column(String, nullable=False)
    result_path = Column(String)  # 예: 결과 파일 경로(.ply/.glb 등)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default='running')  # running, done, failed 등
    is_published = Column(Boolean, default=False)

    def __repr__(self):
        return f"<Job(id={self.id}, user_id={self.user_id}, job_uuid='{self.job_uuid}', status='{self.status}')>"