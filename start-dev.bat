@echo off
echo Starting EV Spare Parts Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000/api
echo.
echo Press any key to exit...
pause > nul