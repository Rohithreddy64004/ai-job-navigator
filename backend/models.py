from pydantic import BaseModel, EmailStr

class User(BaseModel):
    name: str
    email: EmailStr
    password: str

class Job(BaseModel):
    title: str
    company: str
    skills: list
    link: str
