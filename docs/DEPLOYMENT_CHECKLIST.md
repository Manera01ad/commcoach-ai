# ✅ CommCoach Deployment Checklist

Use this checklist to ensure smooth deployment of your CommCoach application.

---

## 📦 Pre-Deployment Checklist

### Local Testing
- [ ] Frontend runs successfully (`npm run dev` in frontend folder)
- [ ] Backend runs successfully (`npm run dev` in backend folder)
- [ ] Backend health check works: `http://localhost:3001/health`
- [ ] Frontend can connect to backend API
- [ ] All environment variables are set in `.env` files
- [ ] No console errors in browser
- [ ] Gemini API integration works

### Code Repository
- [ ] All code is committed to Git
- [ ] `.gitignore` properly excludes `node_modules`, `.env`, and build files
- [ ] Code is pushed to GitHub
- [ ] Repository is public OR you have proper access permissions

### API Keys & Secrets
- [ ] Gemini API Key obtained from https://aistudio.google.com/app/apikey
- [ ] API key is tested and working locally
- [ ] `.env.example` files are up to date
- [ ] Never commit `.env` files with real credentials

---

## 🚂 Backend Deployment (Railway)

### Account Setup
- [ ] Railway account created at https://railway.app
- [ ] GitHub account connected to Railway

### Deployment Steps
- [ ] New project created in Railway
- [ ] GitHub repository connected
- [ ] `backend` folder selected as root directory
- [ ] Build logs show successful build

### Environment Variables (Railway Dashboard)
Copy these values to Railway's environment variables:
```
PORT=3001
NODE_ENV=production
GEMINI_API_KEY=<your-actual-gemini-api-key>
ALLOWED_ORIGINS=https://commcoach-ai.vercel.app,http://localhost:5173
```

- [ ] All environment variables added
- [ ] Correct Gemini API key pasted
- [ ] No extra spaces in values

### Backend Verification
- [ ] Deployment completed successfully
- [ ] Railway URL noted down: `_________________.railway.app`
- [ ] Health endpoint works: `https://your-backend.railway.app/health`
- [ ] API endpoint works: `https://your-backend.railway.app/api`

Expected `/health` response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T...",
  "uptime": 123.45,
  "environment": "production"
}
```

---

## ▲ Frontend Deployment (Vercel)

### Account Setup
- [ ] Vercel account created at https://vercel.com
- [ ] GitHub account connected to Vercel

### Deployment Configuration
- [ ] New project created in Vercel
- [ ] GitHub repository imported
- [ ] Framework detected as "Vite"
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables (Vercel Dashboard)
Add this in Vercel's environment variables section:
```
VITE_API_URL=https://<your-backend-url>.railway.app/api
```

- [ ] Backend URL from Railway pasted correctly
- [ ] URL ends with `/api`
- [ ] No trailing slash after `/api`

### Frontend Verification
- [ ] Build completed successfully
- [ ] No build errors in logs
- [ ] Vercel URL noted down: `_________________.vercel.app`
- [ ] Website loads without errors
- [ ] Browser console shows no errors
- [ ] Styles load correctly

---

## 🔗 Integration Testing

### CORS Configuration
- [ ] Backend `ALLOWED_ORIGINS` includes Vercel URL
- [ ] No CORS errors in browser console
- [ ] Railway redeployed after updating CORS

### End-to-End Testing
- [ ] Open your Vercel URL in browser
- [ ] Test main communication features
- [ ] Verify API calls work (check Network tab)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile device

### API Response Testing
From browser console, test API connection:
```javascript
fetch('https://your-backend.railway.app/api')
  .then(r => r.json())
  .then(data => console.log(data));
```

- [ ] API responds correctly
- [ ] Response includes all endpoints
- [ ] No authentication errors

---

## 🔍 Post-Deployment Verification

### Performance
- [ ] Frontend loads in < 3 seconds
- [ ] API responses are quick (< 2 seconds)
- [ ] No timeout errors

### Monitoring
- [ ] Railway logs showing no errors
- [ ] Vercel logs showing successful requests
- [ ] Set up error tracking (optional: Sentry)

### Documentation
- [ ] Update README with live URLs
- [ ] Document any deployment-specific notes
- [ ] Share deployment URLs with team

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Frontend loads at your Vercel URL
- ✅ Backend health check returns `{"status": "ok"}`
- ✅ Frontend can make API calls to backend
- ✅ No CORS errors
- ✅ Communication analysis features work
- ✅ No errors in browser console
- ✅ No errors in Railway/Vercel logs

---

## 🐛 Common Issues & Solutions

### "Cannot connect to backend"
**Solution:** 
- Check `VITE_API_URL` in Vercel environment variables
- Ensure it includes `/api` at the end
- Verify Railway backend is running

### "CORS Error"
**Solution:**
- Update `ALLOWED_ORIGINS` in Railway to include Vercel URL
- Redeploy Railway after changing environment variables
- Check for typos in URLs

### "Build failed on Vercel"
**Solution:**
- Check Vercel build logs for specific error
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### "Gemini API Error"
**Solution:**
- Verify `GEMINI_API_KEY` is correct in Railway
- Check API key quota/limits
- Test API key locally first

### "Page not found" on refresh
**Solution:**
- Ensure `vercel.json` has proper rewrites configuration
- Already configured in your project!

---

## 📊 Deployment URLs

Fill in after deployment:

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (Vercel)** | https://_________________.vercel.app | ⬜ |
| **Backend (Railway)** | https://_________________.railway.app | ⬜ |
| **Health Check** | https://_________________.railway.app/health | ⬜ |
| **API Endpoint** | https://_________________.railway.app/api | ⬜ |

---

## 🚀 Next Steps After Deployment

1. **Custom Domain (Optional)**
   - Buy domain from Namecheap/GoDaddy
   - Connect to Vercel for frontend
   - Use Vercel's domain management

2. **Analytics (Optional)**
   - Add Google Analytics
   - Use Vercel Analytics
   - Monitor user behavior

3. **Continuous Deployment**
   - Every `git push` auto-deploys
   - Railway: Backend auto-deploys
   - Vercel: Frontend auto-deploys

4. **Share & Test**
   - Share URL with friends/testers
   - Gather feedback
   - Iterate and improve

---

**🎊 Congratulations! Your CommCoach AI is now live!**

Need help? Check the main `DEPLOYMENT.md` for detailed instructions.
