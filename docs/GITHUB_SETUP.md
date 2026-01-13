# 📦 GitHub Repository Setup Guide

This guide will help you create a GitHub repository and push your CommCoach code to it.

---

## 🎯 **Quick Overview**

You'll need to:
1. Create a repository on GitHub.com (2 minutes)
2. Push your code using our automated script (1 minute)
3. Verify your code is on GitHub (30 seconds)

**Total Time:** ~4 minutes

---

## 📝 **Step 1: Create Repository on GitHub.com**

### A. Sign In to GitHub
1. Go to https://github.com/login
2. Sign in with your GitHub account
   - **Don't have an account?** Create one at https://github.com/signup

### B. Create New Repository
1. Go to https://github.com/new (or click the "+" icon → "New repository")
2. Fill in the form:

   **Repository name:**
   ```
   commcoach-ai
   ```

   **Description:**
   ```
   AI-powered communication coaching platform with real-time feedback and analysis
   ```

   **Visibility:**
   - ✅ Choose **Public** (recommended - free deployments on Vercel/Railway)
   - OR Private (if you prefer, but may limit free tier options)

   **⚠️ CRITICAL - Initialize this repository:**
   - ❌ **DO NOT** check "Add a README file"
   - ❌ **DO NOT** select "Add .gitignore"
   - ❌ **DO NOT** select "Choose a license"
   
   > **Why?** Your local repository already has all these files!

3. Click **"Create repository"**

### C. After Creation
After clicking "Create repository", GitHub will show a page with setup instructions.

**IMPORTANT:** Ignore those instructions! We have a better automated script for you below.

---

## 🚀 **Step 2: Push Your Code to GitHub**

Now that your repository is created on GitHub, let's push your code!

### Option A: Use Our Automated Script (Recommended) ⭐

Simply run this command in PowerShell:

```powershell
.\push-to-github.ps1
```

The script will:
1. Ask for your GitHub username
2. Configure the remote repository
3. Push all your code to GitHub
4. Show you the URL to your repository

### Option B: Manual Commands

If you prefer to run commands manually:

```powershell
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/commcoach-ai.git

# Ensure you're on the main branch
git branch -M main

# Push your code
git push -u origin main
```

---

## ✅ **Step 3: Verify Your Code is on GitHub**

1. Go to: `https://github.com/YOUR_USERNAME/commcoach-ai`
2. You should see:
   - ✅ Your README.md file
   - ✅ `frontend/` folder
   - ✅ `backend/` folder
   - ✅ `DEPLOYMENT.md` file
   - ✅ All your code files

---

## 🐛 **Troubleshooting**

### Issue: "Permission denied (publickey)"

**Solution 1: Use HTTPS (Recommended for Windows)**
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/commcoach-ai.git
git push -u origin main
```
When prompted, enter your GitHub credentials.

**Solution 2: Use Personal Access Token**
If password authentication doesn't work:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (all)
4. Copy the token (save it somewhere safe!)
5. When pushing, use the token as your password

### Issue: "Repository not found"

**Causes:**
- Repository name mismatch
- Wrong username
- Repository not created yet

**Solution:**
1. Verify repository exists at `https://github.com/YOUR_USERNAME/commcoach-ai`
2. Check spelling of username and repository name
3. Ensure you created the repository (Step 1)

### Issue: "Updates were rejected"

**Solution:**
```powershell
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Issue: Script execution policy error

**Solution:**
```powershell
# Allow script execution for this session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\push-to-github.ps1
```

---

## 📊 **What Happens Next?**

After your code is on GitHub:

1. ✅ **Automatic Version Control**
   - Every change you make can be tracked
   - You can revert to previous versions anytime

2. ✅ **Ready for Deployment**
   - Vercel can now access your frontend
   - Railway can now access your backend

3. ✅ **Continuous Deployment**
   - Every `git push` will auto-deploy your app
   - No manual uploads needed!

---

## 🎯 **Next Steps**

Once your code is on GitHub, you're ready to deploy!

### Deploy Your App:
1. **Backend to Railway**
   - Follow `DEPLOYMENT.md` Section 1
   - Time: ~5 minutes

2. **Frontend to Vercel**
   - Follow `DEPLOYMENT.md` Section 2
   - Time: ~5 minutes

3. **Test Your Live App**
   - Your app will be live at `commcoach-ai.vercel.app`!

---

## 💡 **Tips**

### Future Updates
To push changes to GitHub:
```powershell
git add .
git commit -m "Your update message"
git push
```

### Check Status
To see what files have changed:
```powershell
git status
```

### View Your Repository
Your repository URL:
```
https://github.com/YOUR_USERNAME/commcoach-ai
```

---

## 🆘 **Need Help?**

### Common Questions

**Q: Do I need to be a Git expert?**
A: No! Just follow the commands in this guide.

**Q: What if I make a mistake?**
A: You can always delete the repository on GitHub and start over.

**Q: Can I make the repository private later?**
A: Yes! Go to Settings → Danger Zone → Change visibility

**Q: How do I get my GitHub username?**
A: Go to https://github.com → Click your profile icon → It's shown there

---

## ✅ **Checklist**

Before moving to deployment, ensure:
- [ ] Repository created on GitHub.com
- [ ] Code pushed successfully
- [ ] Can view repository at `https://github.com/YOUR_USERNAME/commcoach-ai`
- [ ] See all folders: `frontend/`, `backend/`, `docs/`
- [ ] See files: `README.md`, `DEPLOYMENT.md`

---

## 🎉 **Success!**

Congratulations! Your code is now on GitHub and ready for deployment!

**Next:** Open `DEPLOYMENT.md` to deploy your app to the web! 🚀
