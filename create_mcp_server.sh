#!/bin/bash
mkdir -p /home/user/Documents/Cline/MCP
cd /home/user/Documents/Cline/MCP
npx @modelcontextprotocol/create-server firebase-data-server
cd firebase-data-server
npm install firebase-admin
