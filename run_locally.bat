@echo off
echo Starting PolicyGuard AI and Fin-Agent...

echo Launching PolicyGuard Backend (Port 8000)...
start "PolicyGuard Backend" cmd /k "cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000"

echo Launching PolicyGuard Frontend (Port 3000)...
start "PolicyGuard Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo Launching Fin-Agent Backend (Port 8001)...
start "Fin-Agent Backend" cmd /k "cd temp_fin_bot\backend && pip install -r requirements.txt && python app.py"

echo Launching Fin-Agent Frontend (Port 8081)...
start "Fin-Agent Frontend" cmd /k "cd temp_fin_bot\frontend && python -m http.server 8081"

echo.
echo ===================================================
echo   ACCESS LINKS
echo ===================================================
echo   PolicyGuard Dashboard: http://localhost:3000
echo   Fin-Agent Chat:        http://localhost:8081
echo   PolicyGuard API:       http://localhost:8000/docs
echo   Fin-Agent API:         http://localhost:8001/docs
echo ===================================================
echo.
echo All services launched in separate windows.
pause
