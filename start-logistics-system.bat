@echo off
echo ========================================
echo SAIL Logistics System Startup
echo ========================================
echo.

echo Starting sih-25209 Backend (Python FastAPI)...
echo Backend will run on http://localhost:8000
echo.

start "sih-25209 Backend" cmd /k "cd sih-25209 && python backend/main.py"

timeout /t 5 /nobreak >nul

echo.
echo Starting Main Next.js App...
echo Frontend will run on http://localhost:3000
echo.

start "Next.js Frontend" cmd /k "pnpm dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo System Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo   Email:    logistics.marine@sail.in
echo   Password: password
echo.
echo Press any key to open the login page...
pause >nul

start http://localhost:3000/login

echo.
echo Both services are running in separate windows.
echo Close those windows to stop the services.
echo.
pause
