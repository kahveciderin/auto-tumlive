#!/usr/bin/env bash

echo "Searching for iPhone $1 on the network..."
first_line=$(ping "$1.local" |& head -n1)

if ip=$(printf '%s\n' "$first_line" | grep -oE '192\.168\.1\.[0-9]+'); then
    UP_TEXT=$(nmap -sn "$ip" |& grep "Host is up")
    if [ -n "$UP_TEXT" ]; then
        echo "Found iPhone"
        exit 0
    else
        echo "No iPhone found."
        exit 1
    fi
else
    exit 1
fi
