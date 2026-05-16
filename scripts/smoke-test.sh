#!/bin/bash
# HURC1 POST-DEPLOYMENT SMOKE TEST
# Verifies that critical endpoints are alive after containers are up.

echo "🚀 Starting Hurc1CRM Smoke Tests..."

# Wait a bit for services to settle
sleep 5

# 1. Check Nginx (Port 80)
if curl -s -I http://localhost | grep -q "200\|301\|302\|308"; then
    echo "✅ Nginx is responding."
else
    echo "❌ Error: Nginx (port 80) is not responding correctly."
    exit 1
fi

# 2. Check App API Health
if curl -s http://localhost:3000/api/health | grep -q "status\":\"ok\"\|healthy"; then
    echo "✅ Application API is healthy."
else
    # Fallback to simple root check if /api/health doesn't exist yet
    if curl -s http://localhost:3000 | grep -q "Next.js\|Hurc1"; then
         echo "✅ Application root is responding."
    else
        echo "❌ Error: Application (port 3000) is not responding."
        exit 1
    fi
fi

# 3. Check AI Service (Yolo)
if curl -s http://localhost:5005/health | grep -q "ok\|healthy"; then
    echo "✅ Yolo-service is healthy."
else
    echo "⚠️ Warning: Yolo-service is not responding. AI features may be unavailable."
fi

# 4. Check Redis
if docker exec hurc_redis redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis is responding."
else
    echo "❌ Error: Redis container is not responding."
    exit 1
fi

echo "✨ All critical smoke tests passed!"
