@echo off 
echo Starting ESSSL Library System... 
cd backend 
start cmd /k "npm run dev" 
cd ..\frontend 
start cmd /k "npm start" 
echo. 
echo System started! 
