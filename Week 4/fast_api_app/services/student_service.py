students = [
    {
        "id": 1,
        "name": "Madhur",
        "age": 20,
        "course": "CSE"
    }
]

def get_all_students():
    return students


def get_student(student_id: int):
    for student in students:
        if student["id"] == student_id:
            return student
    return None

def create_student(data):
    new_student = {
        "id": len(students) + 1,
        **data
    }

    students.append(new_student)
    return new_student


def update_student(student_id: int, data):
    student = get_student(student_id)

    if student:
        student.update(data)
        return student

    return None

def delete_student(student_id: int):
    student = get_student(student_id)

    if student:
        students.remove(student)
        return True

    return False