@echo off
echo =======================================================
echo Building ServiceConnect Frontend
echo =======================================================

cd frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo FRONTEND INSTALL FAILED.
    pause
    exit /b %errorlevel%
)

call npm run build
if %errorlevel% neq 0 (
    echo.
    echo FRONTEND BUILD FAILED.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo =======================================================
echo Building ServiceConnect Backend
echo =======================================================

cd backend
call maven\bin\mvn.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo.
    echo BACKEND BUILD FAILED.
    pause
    exit /b %errorlevel%
)

echo.
echo =======================================================
echo Build successful! Starting ServiceConnect Application
echo =======================================================

java -jar target\backend-0.0.1-SNAPSHOT.jar
