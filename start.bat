@echo off
title Parent Decoder Dev Server
echo ========================================
echo   Starting Parent Decoder...
echo ========================================
cd /d "%~dp0app"
node node_modules\vite\bin\vite.js --port 3000 --open
pause
