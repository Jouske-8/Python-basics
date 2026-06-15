class StudentNotFoundException(Exception):
    
    def __init__(self, student_id: int):
        self.student_id = student_id
        self.message = f"Student {student_id} not found"
        super().__init__(self.message)

class ExternalAPIException(Exception):

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)
        
class WeatherAPIException(Exception):
    def __init__(self, message: str):
        self.message = message