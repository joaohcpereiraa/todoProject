@echo off
setlocal

REM Start Node-Api
cd /d "%~dp0..\Node-Api"
start cmd /k "npm run start"

REM Sleep for 5 seconds
timeout /t 5 /nobreak

REM Start client-frontend
cd /d "%~dp0..\client-frontend"
start cmd /k "npm run dev"

endlocal