import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database import engine
from models import db_house

db_house.Base.metadata.create_all(bind=engine)
