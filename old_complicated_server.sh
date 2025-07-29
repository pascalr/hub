#!/bin/bash

## Change directory to "docs"
#cd "$(dirname "$0")/docs"
#
## Start Python HTTP server on port 8000, accessible from the local network
#python3 -m http.server 8000 --bind 0.0.0.0





# Exit on any error
set -e

# Check socat is installed
if ! command -v socat >/dev/null 2>&1; then
    echo "Error: socat is not installed. Install it with: sudo apt install socat"
    exit 1
fi

# PIDs
PYTHON_PID=""
SOCAT_PID=""

# Cleanup function
cleanup() {
    if [[ -n "$SOCAT_PID" ]]; then
        echo "Stopping socat..."
        sudo kill "$SOCAT_PID" 2>/dev/null || true
    fi
    if [[ -n "$PYTHON_PID" ]]; then
        echo "Stopping Python server..."
        kill "$PYTHON_PID" 2>/dev/null || true
    fi
}

# Register cleanup function on exit, error, or Ctrl+C
trap cleanup EXIT INT TERM

# Go to the docs folder
cd "$(dirname "$0")/docs"

# Start Python server in the background on port 8000
echo "Starting Python HTTP server on port 8000..."
python3 -m http.server 8000 --bind 0.0.0.0 &

# Save the PID so we can clean up later
PYTHON_PID=$!

# Give socat a moment to avoid race conditions
sleep 1

# Start socat to forward port 80 → 8000
echo "Starting socat (port 80 → 8000)..."
sudo socat TCP-LISTEN:80,reuseaddr,fork TCP:127.0.0.1:8000 &
SOCAT_PID=$!

# Wait until either is killed
wait $SOCAT_PID
