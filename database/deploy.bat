@echo off
echo ========================================
echo   CommCoach AI - Database Deployment
echo ========================================
echo.

set PROJECT_ID=jmaerbneeavezfrvttzq

echo Step 1/3: Deploying Schema...
echo.
echo Opening Supabase SQL Editor...
start https://app.supabase.com/project/%PROJECT_ID%/sql
echo.
echo INSTRUCTIONS:
echo 1. Click "New query" button (top right)
echo 2. Press Ctrl+V to paste (schema is in clipboard)
echo 3. Click "Run" or press Ctrl+Enter
echo.

REM Copy schema.sql to clipboard
type "schema.sql" | clip

echo [Schema SQL copied to clipboard]
echo.
pause

echo.
echo Step 2/3: Deploying RLS Policies...
echo.

REM Copy rls-policies.sql to clipboard
type "rls-policies.sql" | clip

echo [RLS Policies SQL copied to clipboard]
echo.
echo INSTRUCTIONS:
echo 1. Click "New query" button again
echo 2. Press Ctrl+V to paste
echo 3. Click "Run" or press Ctrl+Enter
echo.
pause

echo.
echo Step 3/3: Deploying Indexes...
echo.

REM Copy indexes.sql to clipboard
type "indexes.sql" | clip

echo [Indexes SQL copied to clipboard]
echo.
echo INSTRUCTIONS:
echo 1. Click "New query" button again
echo 2. Press Ctrl+V to paste
echo 3. Click "Run" or press Ctrl+Enter
echo.
pause

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Verify your database:
start https://app.supabase.com/project/%PROJECT_ID%/database/tables
echo.
echo You should see 16 tables with RLS enabled.
echo.
pause
