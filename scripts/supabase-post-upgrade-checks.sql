-- Supabase Post-Upgrade Verification Script
-- Run this after upgrading to verify success

-- 1. Confirm New PostgreSQL Version
SELECT version();

-- 2. Verify Database Accessibility
SELECT current_database(), current_user, now();

-- 3. Check Extensions Status
SELECT 
    name,
    installed_version,
    CASE 
        WHEN installed_version = default_version THEN 'Up to date'
        ELSE 'Update available'
    END as status
FROM pg_available_extensions
WHERE installed_version IS NOT NULL
ORDER BY name;

-- 4. Verify Table Row Counts Match Pre-Upgrade
SELECT 'volunteer_opportunities' as table_name, COUNT(*) as row_count FROM volunteer_opportunities
UNION ALL
SELECT 'volunteer_applications', COUNT(*) FROM volunteer_applications
UNION ALL
SELECT 'volunteer_hours', COUNT(*) FROM volunteer_hours
UNION ALL
SELECT 'volunteer_verifications', COUNT(*) FROM volunteer_verifications
UNION ALL
SELECT 'wallet_aliases', COUNT(*) FROM wallet_aliases
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
ORDER BY table_name;

-- 5. Test Critical Queries
-- Volunteer Statistics
SELECT 
    COUNT(DISTINCT volunteer_id) as active_volunteers,
    SUM(hours) as total_hours_last_30_days,
    COUNT(*) as total_entries
FROM volunteer_hours
WHERE created_at >= now() - interval '30 days';

-- Active Volunteer Opportunities
SELECT 
    COUNT(*) as active_opportunities,
    COUNT(DISTINCT charity_id) as charities_with_opportunities
FROM volunteer_opportunities
WHERE status = 'active';

-- Pending Applications
SELECT 
    COUNT(*) as pending_applications,
    MIN(applied_at) as oldest_pending
FROM volunteer_applications
WHERE status = 'pending';

-- 6. Check for MD5 Password Hashes (Security)
SELECT 
    rolname,
    CASE 
        WHEN rolpassword LIKE 'md5%' THEN 'NEEDS UPDATE - MD5'
        WHEN rolpassword LIKE 'SCRAM-SHA-256%' THEN 'OK - SCRAM-SHA-256'
        ELSE 'Unknown'
    END as password_status
FROM pg_authid
WHERE rolcanlogin = true
    AND rolpassword LIKE 'md5%';

-- 7. Test RLS Policies
-- This should return data based on current user's permissions
SELECT 'RLS Test - Volunteer Hours' as test, COUNT(*) as visible_rows FROM volunteer_hours;
SELECT 'RLS Test - Volunteer Opportunities' as test, COUNT(*) as visible_rows FROM volunteer_opportunities;
SELECT 'RLS Test - Volunteer Applications' as test, COUNT(*) as visible_rows FROM volunteer_applications;
SELECT 'RLS Test - Wallet Aliases' as test, COUNT(*) as visible_rows FROM wallet_aliases;

-- 8. Check Indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 9. Verify Functions
SELECT 
    n.nspname as schema,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY function_name;

-- 10. Performance Check - Slow Queries
SELECT 
    query,
    calls,
    total_exec_time::numeric(10,2) as total_ms,
    mean_exec_time::numeric(10,2) as mean_ms,
    max_exec_time::numeric(10,2) as max_ms
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_%'
    AND mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;