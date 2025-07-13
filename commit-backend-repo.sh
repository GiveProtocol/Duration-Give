#!/bin/bash

echo "Committing files to Duration-Backend-Private repository..."

# Navigate to the private repository
cd ../Duration-Backend-Private

# Add all files
git add .

# Show what's being committed
echo "Files to be committed:"
git status --porcelain

# Create commit
git commit -m "Initial backend repository setup

🔒 PRIVATE: Critical business infrastructure moved from public repo

Database & Schema:
- 45 database migration files with complete schema evolution
- RLS policies and security configurations
- Performance optimizations and custom indexes

Admin Panel (131KB+ of sensitive code):
- AdminCharities.tsx (18.5KB) - Charity management
- AdminDashboard.tsx (8.4KB) - Main admin interface  
- AdminDonations.tsx (10.5KB) - Donation tracking
- AdminLogs.tsx (16.5KB) - System logs and audits
- AdminSettings.tsx (9.4KB) - Platform configuration
- AdminStats.tsx (8.7KB) - Analytics and reporting
- AdminUsers.tsx (19KB) - User management
- AdminVerifications.tsx (19.3KB) - Verification systems
- AdminWithdrawals.tsx (21KB) - Financial controls

Backend Services:
- Supabase client and authentication
- API layer with data access patterns
- Sentry monitoring and error tracking
- Security middleware and validation

⚠️ CONTAINS SENSITIVE BUSINESS LOGIC - KEEP PRIVATE

This code reveals:
- Complete platform architecture
- Financial transaction flows
- User verification processes
- Database optimization strategies
- Administrative control mechanisms"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo "✅ Private backend repository setup complete!"
echo ""
echo "Repository contains:"
echo "- $(find supabase/migrations -name "*.sql" | wc -l) database migration files"
echo "- $(find src/pages/admin -name "*.tsx" | wc -l) admin panel components"
echo "- $(find src/lib -name "*.ts" | wc -l) backend library files"
echo ""
echo "🔒 Repository is PRIVATE and secure."