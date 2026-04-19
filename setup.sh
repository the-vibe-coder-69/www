#!/bin/bash

# The Vibe Coder Setup Script
echo "🌌 Setting up The Vibe Coder ecosystem..."

# Install Node dependencies
if [ -f "package.json" ]; then
    echo "📦 Installing Node dependencies..."
    npm install
fi

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install chromium

# Check for VHS (optional but recommended for CLI demos)
if ! command -v vhs &> /dev/null
then
    echo "📽️ VHS not found. Install it for terminal recordings: brew install vhs"
fi

echo "✅ Setup complete! Ready to vibe."
