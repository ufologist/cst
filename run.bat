@echo off
echo build, install, run app
echo.
echo Usage:
echo --------------------------
echo remember to modify package, activity for your app first
echo.
echo run
echo run release
echo --------------------------
echo.

set package=com.github.ufologist.cst
set activity=.activity.MainActivity
echo app package: %package%/%activity%
echo.

echo uninstall app
adb uninstall %package%
echo.

echo building...
if "%1"=="" (
    call ant debug install
) else (
    call ant %1 install
)
echo.

echo launch app
adb shell am start -n %package%/%activity%