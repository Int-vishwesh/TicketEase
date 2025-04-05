@echo off
REM Activate virtual environment if it exists
IF EXIST venv\Scripts\activate.bat (
    CALL venv\Scripts\activate.bat
)

REM Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000

