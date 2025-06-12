from sqlalchemy import Column, Integer, String, Float
from database import Base

class House(Base):
    __tablename__ = "houses"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False)
    # city_type = Column(String)  # 농촌 / 도시
    # floor = Column(Integer)
    # area = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    


