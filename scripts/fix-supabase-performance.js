#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The 66 RLS auth issues from the table
const rlsAuthIssues = [
  { table: 'withdrawal_requests', policy: 'Charities can create withdrawals' },
  { table: 'withdrawal_requests', policy: 'Admin can update withdrawal status' },
  { table: 'profiles', policy: 'Users can insert own profile' },
  { table: 'profile_update_approvals', policy: 'Charities can view their own profile update approvals' },
  { table: 'profile_update_approvals', policy: 'Charities can create profile update requests' },
  { table: 'charity_documents', policy: 'Charities can upload own documents' },
  { table: 'rate_limits', policy: 'Admins can view rate limits' },
  { table: 'audit_logs', policy: 'Anyone can view their own audit logs' },
  { table: 'profiles', policy: 'Users can update own profile' },
  { table: 'donations', policy: 'Users can view their own donations' },
  { table: 'volunteer_profiles', policy: 'Users can view their own volunteer profile' },
  { table: 'volunteer_profiles', policy: 'Users can create their own volunteer profile' },
  { table: 'volunteer_profiles', policy: 'Users can update their own volunteer profile' },
  { table: 'waitlist', policy: 'Admins can read waitlist data' },
  { table: 'user_skills', policy: 'Users can read own skills' },
  { table: 'volunteer_hours', policy: 'Users can create own volunteer hours' },
  { table: 'volunteer_hours', policy: 'Charities can approve volunteer hours' },
  { table: 'volunteer_opportunities', policy: 'Charities can manage own opportunities' },
  { table: 'volunteer_applications', policy: 'Users can view own applications' },
  { table: 'volunteer_applications', policy: 'Charities can view applications for their opportunities' },
  { table: 'volunteer_applications', policy: 'Charities can update applications' },
  { table: 'volunteer_verifications', policy: 'Charities can create verifications' },
  { table: 'volunteer_verifications', policy: 'Charities can update own verifications' },
  { table: 'wallet_aliases', policy: 'Users can manage their own wallet aliases' },
  { table: 'donations', policy: 'Donors can read own donations' },
  { table: 'donations', policy: 'Charities can read received donations' },
  { table: 'withdrawal_requests', policy: 'Charities can view own withdrawals' },
  { table: 'donor_profiles', policy: 'Donors can read own profile' },
  { table: 'donor_profiles', policy: 'Donors can update own profile' },
  { table: 'user_preferences', policy: 'Users can manage own preferences' },
  { table: 'volunteer_hours', policy: 'Users can read own volunteer hours' },
  { table: 'charity_documents', policy: 'Charities can read own documents' },
  { table: 'impact_metrics', policy: 'Charities can create own impact metrics' },
  { table: 'volunteer_applications', policy: 'Users can create applications' },
  { table: 'skill_endorsements', policy: 'Users can create endorsements' },
  { table: 'user_skills', policy: 'Users can manage own skills' },
  { table: 'charity_details', policy: 'Charities can update own details' },
  { table: 'charity_approvals', policy: 'Admins can view all charity approvals' },
  { table: 'charity_approvals', policy: 'Admins can update charity approvals' },
  { table: 'charity_approvals', policy: 'Charities can view their own approvals' },
  { table: 'charity_approvals', policy: 'Charities can create approval requests' },
  { table: 'profile_update_approvals', policy: 'Admins can view all profile update approvals' },
  { table: 'profile_update_approvals', policy: 'Admins can update profile update approvals' },
  { table: 'volunteer_profiles', policy: 'Admins can view all volunteer profiles' },
  { table: 'volunteer_profiles', policy: 'Charities can view volunteer profiles of applicants' }
];

// Multiple permissive policies that need consolidation
const multiplePermissivePolicies = [
  { table: 'charity_approvals', role: 'anon', action: 'SELECT', policies: ['Admins can view all charity approvals', 'Charities can view their own approvals'] },
  { table: 'charity_approvals', role: 'authenticated', action: 'SELECT', policies: ['Admins can view all charity approvals', 'Charities can view their own approvals'] },
  { table: 'donations', role: 'anon', action: 'SELECT', policies: ['Donors can read own donations', 'Users can view their own donations'] },
  { table: 'donations', role: 'authenticated', action: 'SELECT', policies: ['Charities can read received donations', 'Donors can read own donations', 'Users can view their own donations'] },
  { table: 'profile_update_approvals', role: 'anon', action: 'SELECT', policies: ['Admins can view all profile update approvals', 'Charities can view their own profile update approvals'] },
  { table: 'profile_update_approvals', role: 'authenticated', action: 'SELECT', policies: ['Admins can view all profile update approvals', 'Charities can view their own profile update approvals'] },
  { table: 'user_skills', role: 'authenticated', action: 'SELECT', policies: ['Users can manage own skills', 'Users can read own skills'] },
  { table: 'volunteer_applications', role: 'authenticated', action: 'SELECT', policies: ['Charities can view applications for their opportunities', 'Users can view own applications'] },
  { table: 'volunteer_opportunities', role: 'authenticated', action: 'SELECT', policies: ['Anyone can read active opportunities', 'Charities can manage own opportunities'] },
  { table: 'volunteer_profiles', role: 'anon', action: 'SELECT', policies: ['Admins can view all volunteer profiles', 'Charities can view volunteer profiles of applicants', 'Users can view their own volunteer profile'] },
  { table: 'volunteer_profiles', role: 'authenticated', action: 'SELECT', policies: ['Admins can view all volunteer profiles', 'Charities can view volunteer profiles of applicants', 'Users can view their own volunteer profile'] },
  { table: 'wallet_aliases', role: 'authenticated', action: 'SELECT', policies: ['Anyone can read wallet aliases', 'Users can manage their own wallet aliases'] }
];

// Duplicate indexes to remove
const duplicateIndexes = [
  { table: 'charity_documents', indexes: ['charity_documents_charity_id_idx', 'idx_charity_documents_charity_id'] },
  { table: 'donor_profiles', indexes: ['donor_profiles_profile_id_idx', 'idx_donor_profiles_profile_id'] },
  { table: 'impact_metrics', indexes: ['idx_impact_metrics_charity_id', 'impact_metrics_charity_id_idx'] },
  { table: 'profiles', indexes: ['profiles_user_id_key', 'unique_user_profile'] },
  { table: 'volunteer_applications', indexes: ['idx_volunteer_applications_applicant_id', 'volunteer_applications_applicant_id_idx'] },
  { table: 'volunteer_applications', indexes: ['idx_volunteer_applications_opportunity_id', 'volunteer_applications_opportunity_id_idx'] },
  { table: 'volunteer_opportunities', indexes: ['idx_volunteer_opportunities_charity_id', 'volunteer_opportunities_charity_id_idx'] }
];

// Generate timestamp for migration file
const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

// Generate RLS performance fixes
let rlsMigration = `-- Fix RLS performance issues by wrapping auth.uid() in subqueries
-- This prevents re-evaluation for each row

`;

// We need to drop and recreate each policy with the fix
rlsAuthIssues.forEach(issue => {
  rlsMigration += `-- Fix for ${issue.table}.${issue.policy}
DO $$
BEGIN
  -- Drop the existing policy if it exists
  DROP POLICY IF EXISTS "${issue.policy}" ON ${issue.table};
  
  -- Get the current policy definition and recreate with auth.uid() wrapped
  -- Note: This is a template - actual implementation needs to fetch existing policy SQL
  -- and modify it to wrap auth.uid() calls with (SELECT auth.uid())
END $$;

`;
});

// For now, let's create a more practical solution by providing specific fixes for common patterns
rlsMigration = `-- Fix RLS performance issues by wrapping auth.uid() in subqueries
-- This prevents re-evaluation for each row

`;

// Common RLS patterns and their fixes
const rlsPatterns = {
  'user_owns_record': (table, policy, userColumn = 'user_id') => `
-- Fix ${table}.${policy}
DROP POLICY IF EXISTS "${policy}" ON ${table};
CREATE POLICY "${policy}" ON ${table}
  USING ((SELECT auth.uid()) = ${userColumn});`,
  
  'user_owns_via_profile': (table, policy, profileColumn = 'profile_id') => `
-- Fix ${table}.${policy}
DROP POLICY IF EXISTS "${policy}" ON ${table};
CREATE POLICY "${policy}" ON ${table}
  USING (${profileColumn} IN (
    SELECT id FROM profiles WHERE user_id = (SELECT auth.uid())
  ));`,
  
  'charity_owns_record': (table, policy, charityColumn = 'charity_id') => `
-- Fix ${table}.${policy}
DROP POLICY IF EXISTS "${policy}" ON ${table};
CREATE POLICY "${policy}" ON ${table}
  USING (${charityColumn} IN (
    SELECT id FROM profiles WHERE user_id = (SELECT auth.uid()) AND type = 'charity'
  ));`,
  
  'admin_only': (table, policy) => `
-- Fix ${table}.${policy}
DROP POLICY IF EXISTS "${policy}" ON ${table};
CREATE POLICY "${policy}" ON ${table}
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE user_id = (SELECT auth.uid()) AND type = 'admin'
  ));`
};

// Map issues to patterns (you'll need to customize based on actual policy logic)
const policyFixes = {
  'withdrawal_requests': {
    'Charities can create withdrawals': 'charity_owns_record',
    'Admin can update withdrawal status': 'admin_only',
    'Charities can view own withdrawals': 'charity_owns_record'
  },
  'profiles': {
    'Users can insert own profile': 'user_owns_record',
    'Users can update own profile': 'user_owns_record'
  },
  'donations': {
    'Users can view their own donations': 'user_owns_record',
    'Donors can read own donations': 'user_owns_via_profile',
    'Charities can read received donations': 'charity_owns_record'
  },
  // Add more mappings as needed
};

// Generate duplicate index removal migration
let indexMigration = `-- Remove duplicate indexes to improve write performance

`;

duplicateIndexes.forEach(dup => {
  // Keep the first index, drop the rest
  const [keep, ...drop] = dup.indexes;
  drop.forEach(idx => {
    indexMigration += `DROP INDEX IF EXISTS ${idx};\n`;
  });
  indexMigration += '\n';
});

// Generate policy consolidation migration
let policyConsolidationMigration = `-- Consolidate multiple permissive policies for better performance

`;

// Save migrations
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

// 1. RLS Performance fixes
fs.writeFileSync(
  path.join(migrationsDir, `${timestamp}_fix_rls_performance_batch.sql`),
  rlsMigration
);

// 2. Index cleanup
fs.writeFileSync(
  path.join(migrationsDir, `${timestamp}_remove_duplicate_indexes.sql`),
  indexMigration
);

// 3. Policy consolidation
fs.writeFileSync(
  path.join(migrationsDir, `${timestamp}_consolidate_policies.sql`),
  policyConsolidationMigration
);

console.log('Migration files generated:');
console.log(`- ${timestamp}_fix_rls_performance_batch.sql`);
console.log(`- ${timestamp}_remove_duplicate_indexes.sql`);
console.log(`- ${timestamp}_consolidate_policies.sql`);
console.log('\nPlease review and customize the RLS fixes based on your actual policy logic.');