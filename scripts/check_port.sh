#!/bin/bash

# Function to check if a port is open
check_port() {
    NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
    host="$NODE_IP"  # Change this to the desired host
    port="$1"  # Port number to check

    # Try connecting to the specified host and port
    if nc -zv "$host" "$port" >/dev/null 2>&1; then
        echo "Port $port is open"
    else
        echo "Port $port is closed"
    fi
}

# Usage: ./check_port.sh PORT_NUMBER
# Example: ./check_port.sh 80

# Check if a port number is provided as an argument
if [ $# -eq 0 ]; then
    echo "Please provide a port number as an argument"
    exit 1
fi

# Call the function to check the provided port
check_port "$1"

