#!/bin/bash

echo "========================================"
echo "SAIL Logistics System Startup"
echo "========================================"
echo ""

echo "Starting sih-25209 Backend (Python FastAPI)..."
echo "Backend will run on http://localhost:8000"
echo ""

cd sih-25209
python3 backend/main.py &
BACKEND_PID=$!
cd ..

sleep 5

echo ""
echo "Starting Main Next.js App..."
echo "Frontend will run on http://localhost:3000"
echo ""

pnpm dev &
FRONTEND_PID=$!

sleep 3

echo ""
echo "========================================"
echo "System Started Successfully!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Login Credentials:"
echo "  Email:    logistics.marine@sail.in"
echo "  Password: password"
echo ""
echo "Opening login page in browser..."

# Open browser based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000/login
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000/login
fi

echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
