@echo off
cd /d "%~dp0"
set ELECTRON_RUN_AS_NODE=
set ELECTRON_DISABLE_GPU=1

:: Limpiar JSONs anteriores
if exist "cypress\reports\*.json" del /q "cypress\reports\*.json"

:: Correr tests y generar JSONs
npx cypress run --reporter mochawesome --reporter-options "reportDir=cypress/reports,overwrite=false,html=false,json=true"

:: Generar Excel siempre, sin importar si hubo fallos
node generate-excel.js

echo.
echo Reporte Excel generado en: cypress\reports\
pause
