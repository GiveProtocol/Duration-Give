# Supabase Postgres Security Upgrade Plan

## Issue Summary
- **Current Version**: supabase-postgres-15.8.1.022
- **Risk**: Outstanding security patches expose known CVEs
- **Priority**: HIGH - Complete within 24 hours

## Pre-Upgrade Checklist

### 1. Verify Current State (Immediate)
```sql
-- Run in Supabase SQL Editor
SELECT version();
SELECT * FROM pg_available_extensions WHERE installed_version IS NOT NULL;
SELECT rolname FROM pg_authid WHERE rolcanlogin = true AND rolpassword LIKE 'md5%';
```

### 2. Backup Strategy
- [ ] Download database backup from Supabase Dashboard
- [ ] Export critical tables:
  ```sql
  -- Export donations data
  COPY (SELECT * FROM donations) TO STDOUT WITH CSV HEADER;
  -- Export charities data
  COPY (SELECT * FROM charities) TO STDOUT WITH CSV HEADER;
  -- Export volunteers data
  COPY (SELECT * FROM volunteers) TO STDOUT WITH CSV HEADER;
  ```

### 3. Document Current Extensions
```sql
SELECT name, default_version, installed_version 
FROM pg_available_extensions 
WHERE installed_version IS NOT NULL
ORDER BY name;
```

## Upgrade Method: In-Place Upgrade (Recommended)

### Why In-Place?
- Faster for databases > 1GB
- Automatic rollback if upgrade fails
- Less platform-level complexity

### Downtime Estimation
- Database size check: Run in SQL Editor
```sql
SELECT pg_database_size(current_database()) / 1024 / 1024 as size_mb;
```
- Estimated downtime: ~10 seconds per 100MB

## Step-by-Step Upgrade Process

### Phase 1: Preparation (Do Now)
1. **Create backup**
   - Go to Supabase Dashboard > Database > Backups
   - Download latest backup
   - Store in secure location

2. **Notify stakeholders**
   - Send email/Slack about maintenance window
   - Suggested window: [DATE] at [TIME] UTC
   - Expected downtime: 15-30 minutes

3. **Test queries**
   - Save output of critical queries for post-upgrade comparison
   ```sql
   -- Donation statistics
   SELECT COUNT(*) as total_donations, SUM(amount) as total_amount FROM donations;
   
   -- Active charities
   SELECT COUNT(*) as active_charities FROM charities WHERE is_active = true;
   
   -- Volunteer hours
   SELECT COUNT(*) as total_volunteers, SUM(hours_logged) as total_hours FROM volunteers;
   ```

### Phase 2: Staging Test (If Available)
1. Clone to staging environment
2. Run upgrade on staging first
3. Verify all functionality works

### Phase 3: Production Upgrade
1. **Start upgrade**
   - Navigate to: Dashboard > Settings > Infrastructure
   - Click "Upgrade project"
   - Select latest stable version
   - Confirm upgrade

2. **Monitor progress**
   - Watch upgrade status in dashboard
   - Monitor for any error messages

3. **Post-upgrade verification**
   ```sql
   -- Verify new version
   SELECT version();
   
   -- Check extensions
   SELECT name, installed_version FROM pg_available_extensions WHERE installed_version IS NOT NULL;
   
   -- Test basic operations
   SELECT COUNT(*) FROM donations LIMIT 1;
   SELECT COUNT(*) FROM charities LIMIT 1;
   SELECT COUNT(*) FROM volunteers LIMIT 1;
   ```

### Phase 4: Application Testing
1. **Smart contract interactions**
   - Test donation creation
   - Test charity registration
   - Test volunteer verification

2. **Frontend functionality**
   - Login/logout flows
   - Data retrieval
   - Form submissions

3. **Background jobs**
   - Check scheduled distributions
   - Verify cron jobs

## Rollback Plan

### If Upgrade Fails
1. Supabase automatically attempts rollback for in-place upgrades
2. If auto-rollback fails:
   - Contact Supabase support immediately
   - Restore from backup created in Phase 1

### Verification After Rollback
```sql
-- Verify original version restored
SELECT version();

-- Check data integrity
SELECT COUNT(*) FROM donations;
SELECT COUNT(*) FROM charities;
SELECT COUNT(*) FROM volunteers;
```

## Post-Upgrade Tasks

### 1. Fix Authentication (If Needed)
```sql
-- Find MD5 hashed roles
SELECT rolname FROM pg_authid WHERE rolcanlogin = true AND rolpassword LIKE 'md5%';

-- Update to SCRAM-SHA-256
ALTER ROLE [role_name] WITH PASSWORD '[new_password]';
```

### 2. Update Documentation
- [ ] Record new Postgres version
- [ ] Document any configuration changes
- [ ] Update runbooks

### 3. Monitor for 72 Hours
- [ ] Check error logs
- [ ] Monitor query performance
- [ ] Verify scheduled jobs

## Contact Information

### Supabase Support
- Dashboard: Help > Support
- Email: support@supabase.io

### Internal Contacts
- Database Admin: [NAME]
- DevOps Lead: [NAME]
- On-call Engineer: [NAME]

## Quick Reference Commands

```bash
# Check current connections
SELECT pid, usename, application_name, client_addr, state 
FROM pg_stat_activity 
WHERE datname = current_database();

# Kill connections if needed (use with caution)
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = current_database() AND pid <> pg_backend_pid();
```

## Notes
- Keep this document updated with actual execution times
- Record any issues encountered for future reference
- Update team wiki with lessons learned

---
**Document Version**: 1.0
**Last Updated**: [Current Date]
**Next Review**: After upgrade completion