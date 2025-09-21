# 🚀 Netlify Deployment Guide

## Prerequisites
- GitHub account
- Netlify account
- Node.js project with dependencies

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit for Netlify deployment"
git branch -M main
git remote add origin https://github.com/yourusername/uk-news-aggregator.git
git push -u origin main
```

### 2. Deploy to Netlify

#### Option A: Connect GitHub Repository
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose "GitHub" and authorize
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`

#### Option B: Drag and Drop
1. Go to [netlify.com](https://netlify.com)
2. Drag the `public` folder to the deploy area
3. Add environment variables if needed

### 3. Environment Variables (Optional)
In Netlify dashboard → Site settings → Environment variables:
- `NODE_ENV=production`
- `SESSION_SECRET=your-secret-key`
- `JWT_SECRET=your-jwt-secret`

### 4. Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings

## Features Available in Demo
- ✅ News aggregation with images
- ✅ Responsive design
- ✅ GDPR compliance UI
- ✅ Accessibility features
- ⚠️ Authentication (demo mode)
- ⚠️ Database (simulated)

## Production Considerations
For full production deployment, consider:
- Database integration (MongoDB, PostgreSQL)
- Authentication service (Auth0, Firebase)
- CDN for static assets
- Monitoring and analytics
- SSL certificates
- Rate limiting

## Troubleshooting
- Check Netlify function logs in dashboard
- Verify CORS headers in functions
- Test API endpoints manually
- Check build logs for errors
