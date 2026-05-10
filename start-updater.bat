@echo off
title 自動更新システム (Auto Updater)
chcp 65001 > nul
echo ====================================
echo  AI熟語先生 - 辞書自動更新システム起動中...
echo ====================================
echo.
node auto-updater.js
echo.
pause
