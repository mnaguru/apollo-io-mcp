#!/bin/bash

echo "Starting Apollo.io Web Application..."
echo ""
echo "Starting API server on port 3001..."
cd api && npm run dev &
API_PID=$!

echo "Waiting for API server to start..."
sleep 3

echo "Starting web frontend on port 5173..."
cd ../web && npm run dev &
WEB_PID=$!

echo ""
echo "================================================"
echo "Apollo.io Web Application is now running!"
echo "================================================"
echo ""
echo "Web Interface: http://localhost:5173"
echo "API Server: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

wait $API_PID $WEB_PID
