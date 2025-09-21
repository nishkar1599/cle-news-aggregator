@echo off
echo 🚀 Preparing for Netlify deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create netlify directory if it doesn't exist
if not exist "netlify\functions" mkdir netlify\functions

REM Build the project
echo 🔨 Building project...
npm run build

echo ✅ Project ready for Netlify deployment!
echo.
echo Next steps:
echo 1. Push to GitHub: git add . ^&^& git commit -m "Deploy to Netlify" ^&^& git push
echo 2. Connect to Netlify: https://app.netlify.com/start
echo 3. Configure build settings:
echo    - Build command: npm run build
echo    - Publish directory: public
echo    - Functions directory: netlify/functions
echo.
echo 🌐 Your site will be available at: https://your-site-name.netlify.app
pause
