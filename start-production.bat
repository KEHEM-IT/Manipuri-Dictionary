@echo off
echo Starting Bishnupriya Dictionary with PM2...
echo.

REM Check if PM2 is installed
where pm2 >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: PM2 is not installed!
    echo Please install PM2 globally: npm install -g pm2
    echo.
    pause
    exit /b 1
)

REM Check if build exists
if not exist "backend\dist\index.js" (
    echo ERROR: Backend build not found!
    echo Please run: setup-production.bat
    echo.
    pause
    exit /b 1
)

if not exist "frontend\dist\index.html" (
    echo ERROR: Frontend build not found!
    echo Please run: setup-production.bat
    echo.
    pause
    exit /b 1
)

REM Start with PM2
call npm run start:pm2

echo.
echo ========================================
echo Application started successfully!
echo ========================================
echo.
echo Access the application at: http://localhost:3000
echo.
echo Useful commands:
echo   npm run logs:pm2      - View logs
echo   npm run monit:pm2     - Monitor resources
echo   npm run restart:pm2   - Restart application
echo   npm run stop:pm2      - Stop application
echo.
