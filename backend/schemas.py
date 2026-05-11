from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str

class ProjectCreate(BaseModel):
    title: str
    description: str

class TaskCreate(BaseModel):
    title: str
    description: str
    status: str
    project_id: int