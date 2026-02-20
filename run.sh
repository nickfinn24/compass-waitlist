#!/bin/bash
cd "$(dirname "$0")"
echo "Building and starting Compass..."
npm run build && npm run start
