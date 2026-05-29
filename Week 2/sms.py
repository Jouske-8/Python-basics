# Student Management CLI App

import json
import os

FILE_NAME = 'students.json'

class StudentManager:
    def __init__(self):
        self.students = self.load_data()

    def load_data(self):
        try:
            if os.path.exists(FILE_NAME):
                with open(FILE_NAME, 'r') as file:
                    return json.load(file)
            return []
        except (json.JSONDecodeError, IOError):
            print("Error loading student data")
            return []
        
                    

    def save_data(self):
        try:
            with open(FILE_NAME, 'w') as file:
                json.dump(self.students, file, indent=4)
        except IOError:
            print("Error Saving data.")
    
    def add_student(self):
        try:
            roll_no = input("Enter Roll Number: ").strip()

            if any(student["roll_no"] == roll_no for student in self.students):
                print("Student with this Roll Number already exists.")
                return
            
            name = input("Enter Name: ").strip()
            age = int(input("Enter Age: "))
            marks = float(input("Enter Marks: "))

            if age <= 0 or not (0 <= marks <= 100):
                print("Invalid age or marks.")
                return
            
            self.students.append({
                "roll_no": roll_no,
                "name": name,
                "age": age,
                "marks": marks
            })

            self.save_data()
            print("Student added successfully.")

        except ValueError:
            print("Age must be integer and marks must be numeric.")

    def view_students(self):
        if not self.students:
            print("No students found.")
            return

        print("\nStudent Records")
        print("-" * 60)

        for student in self.students:
            print(
                f"Roll No: {student['roll_no']} | "
                f"Name: {student['name']} | "
                f"Age: {student['age']} | "
                f"Marks: {student['marks']}"
            )
    
    def update_student(self):
        roll_no = input("Enter Roll Number to update: ").strip()

        for student in self.students:
            if student["roll_no"] == roll_no:
                try:
                    student["name"] = input(
                        f"New Name ({student['name']}): "
                    ) or student["name"]

                    age = input(
                        f"New Age ({student['age']}): "
                    )
                    marks = input(
                        f"New Marks ({student['marks']}): "
                    )

                    if age:
                        age = int(age)
                        if age <= 0:
                            raise ValueError
                        student["age"] = age

                    if marks:
                        marks = float(marks)
                        if not (0 <= marks <= 100):
                            raise ValueError
                        student["marks"] = marks

                    self.save_data()
                    print("Student updated successfully.")
                    return

                except ValueError:
                    print("Invalid age or marks value.")
                    return

        print("Student not found.")
    
    def delete_student(self):
        roll_no = input("Enter Roll Number to delete: ").strip()

        for student in self.students:
            if student["roll_no"] == roll_no:
                self.students.remove(student)
                self.save_data()
                print("Student deleted successfully.")
                return

        print("Student not found.")
    
def main():
    manager = StudentManager()

    while True:
        print("\n===== Student Management System =====")
        print("1. Add Student")
        print("2. View Students")
        print("3. Update Student")
        print("4. Delete Student")
        print("5. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            manager.add_student()

        elif choice == "2":
            manager.view_students()

        elif choice == "3":
            manager.update_student()

        elif choice == "4":
            manager.delete_student()

        elif choice == "5":
            print("Exiting...")
            break

        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()