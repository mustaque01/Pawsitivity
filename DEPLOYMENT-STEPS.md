# 🚀 Deployment Checklist

## Step 1: Commit and Push Backend Changes

```bash
git add .
git commit -m "Add health check endpoints to prevent Render sleep"
git push origin main
```

## Step 2: Render Will Auto-Deploy

- Render detects the git push
- Automatically redeploys your backend
- Wait 2-3 minutes for deployment

## Step 3: Test Health Endpoints

After deployment, test these URLs:

1. **Main endpoint**: https://pawsitivity-backend-zlhq.onrender.com/
2. **Health check**: https://pawsitivity-backend-zlhq.onrender.com/api/health

Both should return JSON response.

## Step 4: Set Up UptimeRobot

1. Go to https://uptimerobot.com/
2. Sign up (free)
3. Click "Add New Monitor"
4. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Pawsitivity Backend
   - **URL**: `https://pawsitivity-backend-zlhq.onrender.com/api/health`
   - **Monitoring Interval**: 5 minutes
5. Save

## ✅ Done!

Your backend will now stay awake 24/7 for FREE! 🎉
