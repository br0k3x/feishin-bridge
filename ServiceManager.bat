@ECHO OFF
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit
)

title Feishin Bridge Service Manager
:::
:::
:::
:::   _____                 _            __  __                                   
:::  / ____|               (_)          |  \/  |                                  
::: | (___   ___ _ ____   ___  ___ ___  | \  / | __ _ _ __   __ _  __ _  ___ _ __ 
:::  \___ \ / _ \ '__\ \ / / |/ __/ _ \ | |\/| |/ _` | '_ \ / _` |/ _` |/ _ \ '__|
:::  ____) |  __/ |   \ V /| | (_|  __/ | |  | | (_| | | | | (_| | (_| |  __/ |   
::: |_____/ \___|_|    \_/ |_|\___\___| |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|   
::: for Feishin Rainmeter Bridge                                   __/ |          
:::                                                               |___/                    
:::
:::
:::
for /f "delims=: tokens=*" %%A in ('findstr /b ::: "%~f0"') do @echo(%%A
pause 	
:Menu
cls
echo.
echo. 
cd /d %~dp0%
echo Currently running at %~dp0%
echo ------- API
echo [1] Install the API service
echo [2] Uninstall the API service
echo ------- RM
echo [3] Install Rainmeter skin
echo [4] Uninstall Rainmeter skin
echo ------- OTHER
echo [0] Exit Service Manager
echo -------

set /p Ch=Choice: 

if "%Ch%"=="1" (
    echo Installing service..
    start npm install express ws
    nssm.exe install FeishinRMBridge "C:\Program Files\nodejs\node.exe" "%CD%\main.js"
    nssm.exe set FeishinRMBridge Description "The API used for the Feishin Rainmeter Bridge."
    nssm.exe set FeishinRMBridge AppStdout "%CD%\logs\out.log"
    nssm.exe set FeishinRMBridge AppStderr "%CD%\logs\err.log"
    nssm.exe start FeishinRMBridge
    echo Installation complete.
    pause
    goto Menu
)
if "%Ch%"=="2" (
    echo Uninstalling service...
    nssm.exe stop FeishinRMBridge
    nssm.exe remove FeishinRMBridge confirm
    echo Uninstallation complete.
    pause
    goto Menu
)
if "%Ch%"=="3" (
    echo Installing Rainmeter skin...
    xcopy "%CD%/skins/Feishin Bridge" "%USERPROFILE%\Documents\Rainmeter\Skins\Feishin Bridge" /E /H /C	/I /Y
    echo Rainmeter skin installed.
    pause
    goto Menu	
)
if "%Ch%"=="4" (
    echo Uninstalling Rainmeter skin...
    :: Replace the following line with actual uninstall commands
    rmdir /S /Q "%USERPROFILE%\Documents\Rainmeter\Skins\Feishin Bridge"
    echo Rainmeter skin uninstalled.
    pause
    goto Menu
)
if "%Ch%"=="0" (
    echo Exiting...
    exit
)

