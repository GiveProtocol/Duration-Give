# Repository Migration Scripts

Automated migration scripts to reorganize Give Protocol from monorepo to multi-repo structure.

## Quick Start

```bash
# Run complete migration
./migrate-repos.sh
```

## What This Does

Creates 4 new repositories in `/home/drigo/projects/`:

1. **give-protocol-contracts** - Smart contracts and deployment
2. **give-protocol-webapp** - React PWA frontend
3. **give-protocol-backend** - API and indexing services
4. **give-protocol-docs** - Documentation site

## Individual Scripts

Run separately if needed:

```bash
./migrate-contracts.sh    # Smart contracts only
./migrate-webapp.sh       # Frontend only
./migrate-backend.sh      # Backend only
./migrate-docs.sh         # Documentation only
```

## Safety

- ✅ Your original repositories are NOT modified
- ✅ New repositories are created separately
- ✅ You can review before committing
- ✅ Easy to delete and re-run if needed

## What's Copied

### give-protocol-contracts
- `contracts/` directory
- `hardhat.config.cjs`
- Deployment scripts
- Contract tests
- Security and fuzzing configs

### give-protocol-webapp
- `src/` directory (all React code)
- `public/` assets
- Vite configuration
- ESLint, TypeScript configs
- Testing configs (Jest, Cypress)
- Supabase configs

### give-protocol-backend
- Complete copy of Duration-Backend-Private
- API endpoints and middleware
- Database schemas
- Supabase functions

### give-protocol-docs
- `docs/` directory (Jekyll site)
- Documentation markdown files
- GitHub Pages deployment config

## After Migration

1. Review each new repository
2. Run `npm install` in each
3. Set up `.env` files (use `.env.example` as template)
4. Create GitHub repositories
5. Push to GitHub
6. Set up CI/CD

See **MIGRATION-GUIDE.md** for detailed post-migration steps.

## Files Created

Each repository gets:
- ✅ `README.md` - Project overview
- ✅ `package.json` - Dependencies and scripts
- ✅ `.gitignore` - Proper ignore rules
- ✅ `.env.example` - Environment template

## Troubleshooting

**Problem**: Script fails with permission error
**Solution**: Run `chmod +x *.sh`

**Problem**: Repository already exists
**Solution**: Delete or rename existing directory first

**Problem**: Want to redo migration
**Solution**: Delete new repos and re-run scripts

## Next Steps

1. Run migration: `./migrate-repos.sh`
2. Read full guide: `MIGRATION-GUIDE.md`
3. Verify repositories
4. Create on GitHub
5. Deploy!

---

For complete instructions, see **MIGRATION-GUIDE.md**
