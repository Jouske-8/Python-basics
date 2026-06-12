from fastapi import APIRouter, HTTPException, status
from typing import List

from schemas.student_schema import (
    StudentCreate,
    StudentResponse,
    StudentUpdate
)

from services.student_service import (
    get_all_students,
    get_student,
    create_student,
    update_student,
    delete_student
)

from exceptions.custom_exceptions import (
    StudentNotFoundException
)

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


# GET ALL
@router.get(
    "/",
    response_model=List[StudentResponse],
    status_code=status.HTTP_200_OK
)
def fetch_students():
    return get_all_students()


# GET BY ID (Path Parameter)
@router.get(
    "/{student_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK
)
def fetch_student(student_id: int):

    student = get_student(student_id)

    if not student:
        raise StudentNotFoundException(
            student_id
        )

    return student


# GET WITH QUERY PARAMETER
@router.get("/search/")
def search_students(course: str):

    result = [
        s for s in get_all_students()
        if s["course"].lower() == course.lower()
    ]

    return result


# POST
@router.post(
    "/",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED
)
def add_student(student: StudentCreate):
    return create_student(student.dict())


# PUT
@router.put(
    "/{student_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK
)
def modify_student(
        student_id: int,
        student: StudentUpdate
):

    updated = update_student(
        student_id,
        student.dict(exclude_unset=True)
    )

    if not updated:
        raise StudentNotFoundException(
            student_id
        )

    return updated


# DELETE
@router.delete(
    "/{student_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def remove_student(student_id: int):

    deleted = delete_student(student_id)

    if not deleted:
        raise StudentNotFoundException(
            student_id
        )

    return