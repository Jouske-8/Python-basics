from fastapi import FastAPI
from routes.student_routes import router

app = FastAPI(
    title="Student Management API",
    version="1.0"
)

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "FastAPI Application Running"
    }