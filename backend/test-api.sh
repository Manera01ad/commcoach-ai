#!/bin/bash

# CommCoach Backend API Test Script
# Run this script to test all endpoints

echo ""
echo "🧪 Testing CommCoach Backend API"
echo "================================"
echo ""

BASE_URL="http://localhost:3001"

# Test 1: Health Check
echo "Test 1: Health Check"
echo "GET $BASE_URL/health"
echo ""
curl -s $BASE_URL/health | json_pp
echo ""
echo "================================"
echo ""

# Test 2: API Root
echo "Test 2: API Root"
echo "GET $BASE_URL/api"
echo ""
curl -s $BASE_URL/api | json_pp
echo ""
echo "================================"
echo ""

# Test 3: Antigravity Test Endpoint
echo "Test 3: Antigravity Test"
echo "GET $BASE_URL/api/antigravity/test"
echo ""
curl -s $BASE_URL/api/antigravity/test | json_pp
echo ""
echo "================================"
echo ""

# Test 4: Gemini Models
echo "Test 4: Gemini Models"
echo "GET $BASE_URL/api/gemini/models"
echo ""
curl -s $BASE_URL/api/gemini/models | json_pp
echo ""
echo "================================"
echo ""

# Test 5: Gemini Generate (requires API key)
echo "Test 5: Gemini Generate"
echo "POST $BASE_URL/api/gemini/generate"
echo ""
curl -s -X POST $BASE_URL/api/gemini/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "prompt": "Say hello in a professional manner"
  }' | json_pp
echo ""
echo "================================"
echo ""

# Test 6: Antigravity Analysis (requires API key)
echo "Test 6: Antigravity Analysis"
echo "POST $BASE_URL/api/antigravity/analyze-session"
echo ""
curl -s -X POST $BASE_URL/api/antigravity/analyze-session \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_1",
    "timestamp": "2025-01-12T00:00:00Z",
    "transcript": "USER: I struggle with public speaking. I get nervous.\nCOACH: Tell me more about when this happens.\nUSER: Mainly in meetings with executives. I feel like I am not good enough."
  }' | json_pp
echo ""
echo "================================"
echo ""
echo "✅ Testing Complete!"
echo ""
echo "Note: Tests 5 and 6 require a valid GEMINI_API_KEY in your .env file"
echo ""
