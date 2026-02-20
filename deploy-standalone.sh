#!/bin/bash
# Run from career-platform root. Creates compass-waitlist repo and deploys.
set -e
REPO="${1:-compass-waitlist}"
USER="${2:-nickfinn24}"

echo "Pushing waitlist to https://github.com/${USER}/${REPO}.git"
echo "Make sure you've created an empty repo at github.com/new named: ${REPO}"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

cd "$(dirname "$0")/.."
git push "https://github.com/${USER}/${REPO}.git" waitlist-only:main

echo ""
echo "Done! Now go to https://vercel.com/new and import ${REPO}"
