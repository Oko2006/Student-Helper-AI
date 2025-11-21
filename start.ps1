# AI Student Chatbot - Development Server Startup Script

Write-Host "🚀 Starting AI Student Chatbot..." -ForegroundColor Cyan
Write-Host ""

# Check if running in project directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Check if Node modules are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if backend virtual environment exists
if (-not (Test-Path "backend\venv")) {
    Write-Host "🐍 Creating Python virtual environment..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv venv
    Set-Location ..
}

# Check if backend dependencies are installed
if (-not (Test-Path "backend\venv\Lib\site-packages\django")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    deactivate
    Set-Location ..
}

# Check if .env file exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "   Please copy backend\.env.example to backend\.env" -ForegroundColor Yellow
    Write-Host "   and add your credentials before starting the servers." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue anyway or Ctrl+C to exit"
}

Write-Host ""
Write-Host "✨ Starting servers..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\venv\Scripts\Activate.ps1; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Green; python manage.py runserver"

# Wait a bit for backend to start
Start-Sleep -Seconds 2

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '📱 Frontend Server Starting...' -ForegroundColor Green; npm run dev"

Write-Host "✅ Servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "If this is your first time running the app:" -ForegroundColor Yellow
Write-Host "1. Make sure PostgreSQL is running" -ForegroundColor White
Write-Host "2. Run migrations: cd backend && python manage.py migrate" -ForegroundColor White
Write-Host "3. Visit http://localhost:3000 to use the app" -ForegroundColor White
