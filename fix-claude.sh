#!/bin/bash

# Script to fix Claude Code installation issues
# This addresses auto-update failures

set -e

echo "================================"
echo "Claude Code Fix Script"
echo "================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

echo "Step 1: Checking current Claude Code installation..."
if command -v claude &> /dev/null; then
    echo "Current version:"
    claude --version || echo "Unable to get version"
else
    echo "Claude Code is not currently in PATH"
fi
echo ""

echo "Step 2: Attempting to run claude doctor..."
if command -v claude &> /dev/null; then
    claude doctor || echo "claude doctor failed or is not available"
else
    echo "Skipping doctor check (claude not found in PATH)"
fi
echo ""

echo "Step 3: Reinstalling Claude Code globally..."
echo "This will fix corrupted installations and update to the latest version."
npm install -g @anthropic-ai/claude-code

echo ""
echo "Step 4: Verifying installation..."
if command -v claude &> /dev/null; then
    echo "✓ Claude Code is now installed"
    claude --version
else
    echo "✗ Claude Code installation verification failed"
    echo ""
    echo "Troubleshooting tips:"
    echo "1. Check your npm global path: npm config get prefix"
    echo "2. Ensure the npm bin directory is in your PATH"
    echo "3. Try running: export PATH=\"\$(npm config get prefix)/bin:\$PATH\""
    exit 1
fi

echo ""
echo "================================"
echo "✓ Claude Code has been fixed!"
echo "================================"
echo ""
echo "You can now restart your terminal or run 'claude' to use it."
