@echo off
setlocal
set "PROJECT_ROOT=%~dp0"

rem Branch with goto rather than parenthesized if-blocks. Inside a block, cmd.exe
rem expands %errorlevel% when it PARSES the block, before `call` has run, so a
rem failing adapter would report success.
if exist "%PROJECT_ROOT%commands\open-demo.bat" goto :adapter
if exist "%PROJECT_ROOT%index.html" goto :page

start "" "%PROJECT_ROOT%"
exit /b %errorlevel%

:adapter
call "%PROJECT_ROOT%commands\open-demo.bat"
exit /b %errorlevel%

:page
start "" "%PROJECT_ROOT%index.html"
exit /b %errorlevel%
