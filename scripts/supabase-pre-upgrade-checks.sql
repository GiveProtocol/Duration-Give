-- Supabase Pre-Upgrade Verification Script
-- Run this before upgrading to document current state

-- 1. Current PostgreSQL Version
SELECT version();

-- 2. Database Size
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = current_database();

-- 3. Installed Extensions
SELECT 
    name,
    default_version,
    installed_version,
    comment
FROM pg_available_extensions
WHERE installed_version IS NOT NULL
ORDER BY name;

-- 4. Custom Roles with MD5 Passwords
SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin,
    CASE 
        WHEN rolpassword LIKE 'md5%' THEN 'MD5 (needs update)'
        WHEN rolpassword LIKE 'SCRAM-SHA-256%' THEN 'SCRAM-SHA-256 (OK)'
        ELSE 'Other'
    END as password_type
FROM pg_authid
WHERE rolcanlogin = true
ORDER BY rolname;

-- 5. Table Row Counts (for verification)
-- First, let's see what tables actually exist
SELECT 
    schemaname,
    tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count rows for known tables (adjust based on what exists)
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

-- 6. Active Connections
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    backend_start,
    state,
    query
FROM pg_stat_activity
WHERE datname = current_database()
ORDER BY backend_start;

-- 7. Replication Slots (if any)
SELECT 
    slot_name,
    plugin,
    slot_type,
    database,
    active,
    restart_lsn
FROM pg_replication_slots;

-- 8. Large Tables (> 100MB)
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    AND pg_total_relation_size(schemaname||'.'||tablename) > 100 * 1024 * 1024
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 9. Configuration Parameters
SELECT 
    name,
    setting,
    unit,
    category
FROM pg_settings
WHERE source != 'default'
ORDER BY category, name;