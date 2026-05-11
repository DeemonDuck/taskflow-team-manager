from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from database import SessionLocal, engine
from models import Base, User, Project, Task

from schemas import (
    UserCreate,
    UserLogin,
    ProjectCreate,
    TaskCreate
)

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    payload = verify_token(token)

    user = db.query(User).filter(
        User.id == payload["user_id"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


def require_admin(
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user


@app.get("/")
def home():

    return {
        "message": "TaskFlow Backend Running"
    }


@app.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_pw = hash_password(user.password)

    role = "admin" if "admin" in user.email else "member"

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_pw,
        role=role
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "role": role
    }


@app.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:

        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    token = create_access_token(
        data={
            "user_id": db_user.id,
            "role": db_user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role
    }


@app.post("/projects")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    new_project = Project(
        title=project.title,
        description=project.description,
        owner_id=current_user.id
    )

    db.add(new_project)

    db.commit()

    db.refresh(new_project)

    return {
        "message": "Project created successfully",
        "project": {
            "id": new_project.id,
            "title": new_project.title
        }
    }


@app.get("/projects")
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    projects = db.query(Project).filter(
        Project.owner_id == current_user.id
    ).all()

    return projects


@app.post("/tasks")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    project = db.query(Project).filter(
        Project.id == task.project_id
    ).first()

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    new_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        project_id=task.project_id
    )

    db.add(new_task)

    db.commit()

    db.refresh(new_task)

    return {
        "message": "Task created successfully",
        "task": {
            "id": new_task.id,
            "title": new_task.title,
            "status": new_task.status
        }
    }


@app.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    tasks = db.query(Task).all()

    return tasks


@app.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    total_projects = db.query(Project).count()

    total_tasks = db.query(Task).count()

    completed_tasks = db.query(Task).filter(
        Task.status == "Completed"
    ).count()

    pending_tasks = db.query(Task).filter(
        Task.status == "Pending"
    ).count()

    return {
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks
    }