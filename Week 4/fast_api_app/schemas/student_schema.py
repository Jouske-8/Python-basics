from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class StudentCreate(BaseModel):
    name: str = Field(
        min_length=3,
        max_length=50,
        description="Student name"
    )

    age: int = Field(
        gt=0,
        lt=100
    )

    email: EmailStr

    course: str = Field(
        min_length=2,
        max_length=30
    )

class StudentResponse(BaseModel):
    id: int
    name: str
    age: int
    email: EmailStr
    course: str

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    email: Optional[EmailStr] = None
    course: Optional[str] = None