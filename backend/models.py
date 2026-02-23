import os
from typing import Annotated
from fastapi import Depends
from sqlmodel import Field, Session, SQLModel, create_engine, Column, JSON, select
from dotenv import load_dotenv

load_dotenv()

class CV(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    phone: str
    address: str
    linkedin: str
    github: str
    summary: str
    #Column(JSON) helps in converting lists to/from strings
    education: list = Field(default_factory=list, sa_column=Column(JSON))
    experience: list = Field(default_factory=list, sa_column=Column(JSON))
    skills: list = Field(default_factory=list, sa_column=Column(JSON))
    languages: list = Field(default_factory=list, sa_column=Column(JSON))
    certifications: list = Field(default_factory=list, sa_column=Column(JSON))
    raw_text: str = ""

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file")

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]


# engine, to hold connections to db.
# sq_lite_file_name = "database.db"
# sqlite_url = f"sqlite:///{sq_lite_file_name}"

# connect_args = {"check_same_thread": False}
# engine = create_engine(sqlite_url, connect_args=connect_args)

# #table
# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)

# #session dependency, 
# def get_session():
#     with Session(engine) as session:
#         yield session

# SessionDep = Annotated[Session, Depends(get_session)]


