#!/bin/sh
set -e

echo "Running Prisma migrations..."
./node_modules/.bin/prisma db push

echo "Starting Next.js..."
exec node server.js
