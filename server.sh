#!/bin/bash

# Change directory to "docs"
cd "$(dirname "$0")/docs"

# Start Python HTTP server on port 8000, accessible from the local network
python3 -m http.server 8000 --bind 0.0.0.0




# To make it run at startup
#
# sudo vi /etc/systemd/system/hub_server.service


# [Unit]
# Description=Hub Web Server
# After=network.target
# 
# [Service]
# ExecStart=/home/USERNAME/hub/server.sh
# WorkingDirectory=/home/USERNAME/hub/
# Restart=always
# User=USERNAME
# StandardOutput=null
# StandardError=null
# 
# [Install]
# WantedBy=multi-user.target


# Enable and start the service:
# 
# sudo systemctl daemon-reexec
# sudo systemctl daemon-reload
# sudo systemctl enable hub_server.service
# sudo systemctl start hub_server.service
# 
# Check if it’s working:
# 
# sudo systemctl status hub_server.service
