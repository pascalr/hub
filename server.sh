#!/bin/bash

# Change directory to "docs"
cd "$(dirname "$0")/docs"

# Start Python HTTP server on port 8000, accessible from the local network
python3 -m http.server 8000 --bind 0.0.0.0
