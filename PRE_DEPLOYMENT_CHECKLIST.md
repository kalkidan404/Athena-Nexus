# Pre-Deployment Checklist

Use this checklist before pushing to GitHub and deploying to Vercel.

## Code Updates
- [x] All "Sisterhood Challenges" references changed to "Athena Nexus"
- [x] Quote "Discipline is the motivation" added to Home and About pages
- [x] Admin login instructions removed from Login page
- [x] Telegram contact link added to About page
- [x] Stats section shows real data from API
- [x] All axios calls updated to use configured API instance

## Configuration Files
- [x] `vercel.json` created for deployment
- [x] Package.json names updated to Athena Nexus
- [x] CORS configuration updated for production
- [x] API base URL configuration added
- [x] Environment variable examples created

## Files to Review
- [ ] Check all environment variables are documented
- [ ] Verify .gitignore includes all necessary files
- [ ] Ensure no sensitive data in code
- [ ] Test locally before deploying

## Before Pushing to GitHub
1. **Remove sensitive data**:
   - Check for any hardcoded passwords, API keys, or secrets
   - Ensure `.env` files are in `.gitignore`
   - Remove any test credentials

2. **Final code review**:
   - Run `npm run build` in client directory to check for build errors
   - Test all major features locally
   - Check console for any errors

3. **Git setup**:
   ```bash
   git add .
   git commit -m "Finalize Athena Nexus for deployment"
   git push origin main
   ```

## Before Deploying to Vercel
1. **Set up MongoDB Atlas**:
   - Create cluster
   - Create database user
   - Whitelist IPs (0.0.0.0/0 for Vercel)
   - Get connection string

2. **Prepare environment variables**:
   - Generate JWT secret: `cd server && npm run generate-secret`
   - Prepare MongoDB URI
   - Note your frontend URL (will be set after first deploy)

3. **Deploy backend first**:
   - Deploy server
   - Get backend URL
   - Test API endpoints

4. **Deploy frontend**:
   - Set `REACT_APP_API_URL` to backend URL
   - Deploy client
   - Test full application

5. **Create admin user**:
   - Use createAdmin script or MongoDB Atlas UI
   - Test admin login

## Post-Deployment
- [ ] Test user registration
- [ ] Test login (regular user and admin)
- [ ] Test challenge creation (admin)
- [ ] Test submission creation
- [ ] Test gallery viewing
- [ ] Check mobile responsiveness
- [ ] Verify all animations work
- [ ] Test dark mode toggle

## Troubleshooting
If something doesn't work:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Check MongoDB Atlas connection
5. Verify CORS settings
6. Check network tab for API calls

