ECHO ON
REM A batch script to execute a Python script
SET PATH=%PATH%;%USERPROFILE%\AppData\Local\Programs\Python\Python37\

start "" /b cmd /c "timeout /nobreak 20 >nul & start /b "" http://localhost:8050/"

python dashboard.py

PAUSE