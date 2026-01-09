@echo off
echo ========================================
echo Bishnupriya Dictionary - Production Setup
echo ========================================
echo.

echo [1/5] Installing root dependencies...
call npm install
if %errorlevel% neq 0 goto error

echo.
echo [2/5] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 goto error
cd ..

echo.
echo [3/5] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 goto error
cd ..

echo.
echo [4/5] Building frontend...
call npm run build:frontend
if %errorlevel% neq 0 goto error

echo.
echo [5/5] Building backend...
call npm run build:backend
if %errorlevel% neq 0 goto error

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo To start the application with PM2:
echo   npm run start:pm2
echo.
echo To start without PM2:
echo   npm start
echo.
goto end

:error
echo.
echo ========================================
echo ERROR: Build failed!
echo ========================================
echo.
exit /b 1

:end
