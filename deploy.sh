#!/bin/bash

echo "🚀 Preparing for Netlify deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create netlify directory if it doesn't exist
mkdir -p netlify/functions

# Copy functions to netlify directory
echo "📁 Setting up Netlify functions..."
cp netlify/functions/*.js netlify/functions/ 2>/dev/null || echo "Functions already in place"

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Project ready for Netlify deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git add . && git commit -m 'Deploy to Netlify' && git push"
echo "2. Connect to Netlify: https://app.netlify.com/start"
echo "3. Configure build settings:"
echo "   - Build command: npm run build"
echo "   - Publish directory: public"
echo "   - Functions directory: netlify/functions"
echo ""
echo "🌐 Your site will be available at: https://your-site-name.netlify.app"
