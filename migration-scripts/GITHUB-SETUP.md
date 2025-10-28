# GitHub Setup Guide

Two options for pushing your repositories to GitHub:

## Option 1: Automated Script (Recommended)

```bash
cd /home/drigo/projects/Duration/migration-scripts
./github-setup.sh
```

The script will:

1. Ask for your GitHub username/organization
2. Ask for visibility preference (private/public)
3. Guide you through creating repos on GitHub
4. Automatically set up remotes and push all 4 repos

---

## Option 2: Manual Setup

### Step 1: Create Repositories on GitHub

Go to https://github.com/new and create **4 new repositories**:

1. **give-protocol-contracts**
   - Description: "Smart contracts for Give Protocol - Blockchain charitable giving platform"
   - Visibility: Private (recommended)
   - ❌ Do NOT initialize with README, .gitignore, or license

2. **give-protocol-webapp**
   - Description: "Progressive Web App for Give Protocol - Donor and charity dashboards"
   - Visibility: Private (recommended)
   - ❌ Do NOT initialize with README, .gitignore, or license

3. **give-protocol-backend**
   - Description: "Backend API and indexing services for Give Protocol"
   - Visibility: Private (recommended)
   - ❌ Do NOT initialize with README, .gitignore, or license

4. **give-protocol-docs**
   - Description: "Documentation site for Give Protocol"
   - Visibility: Public or Private
   - ❌ Do NOT initialize with README, .gitignore, or license

### Step 2: Push Each Repository

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username or organization name.

#### Push Contracts Repository

```bash
cd /home/drigo/projects/give-protocol-contracts

# Initialize if needed
git branch -M main

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Smart contracts migration from monorepo"

# Add remote
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/give-protocol-contracts.git

# Push to GitHub
git push -u origin main
```

#### Push Webapp Repository

```bash
cd /home/drigo/projects/give-protocol-webapp

# Initialize if needed
git branch -M main

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Webapp migration from monorepo"

# Add remote
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/give-protocol-webapp.git

# Push to GitHub
git push -u origin main
```

#### Push Backend Repository

```bash
cd /home/drigo/projects/give-protocol-backend

# Initialize if needed
git branch -M main

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Backend migration from monorepo"

# Add remote
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/give-protocol-backend.git

# Push to GitHub
git push -u origin main
```

#### Push Docs Repository

```bash
cd /home/drigo/projects/give-protocol-docs

# Initialize if needed
git branch -M main

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Documentation migration from monorepo"

# Add remote
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/give-protocol-docs.git

# Push to GitHub
git push -u origin main
```

### Step 3: Verify

Check that all 4 repositories are visible on GitHub:

- https://github.com/YOUR_GITHUB_USERNAME/give-protocol-contracts
- https://github.com/YOUR_GITHUB_USERNAME/give-protocol-webapp
- https://github.com/YOUR_GITHUB_USERNAME/give-protocol-backend
- https://github.com/YOUR_GITHUB_USERNAME/give-protocol-docs

---

## Post-Push Configuration

### 1. Set Up Branch Protection

For each repository on GitHub:

1. Go to **Settings** → **Branches**
2. Add branch protection rule for `main`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require linear history
   - ✅ Include administrators

### 2. Add Repository Secrets

For deployment, add these secrets in **Settings** → **Secrets and variables** → **Actions**:

#### give-protocol-contracts

```
MOONBASE_RPC_URL=<your-moonbase-rpc-url>
PRIVATE_KEY=<your-deployment-private-key>
MOONSCAN_API_KEY=<your-moonscan-api-key>
```

#### give-protocol-webapp

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_MOONBASE_RPC_URL=<your-moonbase-rpc-url>
```

#### give-protocol-backend

```
DATABASE_URL=<your-database-url>
SUPABASE_SERVICE_KEY=<your-supabase-service-key>
MAILCHIMP_API_KEY=<your-mailchimp-api-key>
```

### 3. Enable GitHub Actions

Each repository has GitHub Actions workflows. They'll run automatically on push.

To view:

- Go to **Actions** tab in each repository

### 4. Set Up GitHub Pages (for docs)

In **give-protocol-docs** repository:

1. Go to **Settings** → **Pages**
2. Source: **GitHub Actions**
3. The site will be available at: `https://YOUR_GITHUB_USERNAME.github.io/give-protocol-docs/`

### 5. Add Collaborators

If working with a team:

1. Go to **Settings** → **Collaborators**
2. Add team members with appropriate permissions

---

## Troubleshooting

### Error: Permission denied (publickey)

**Problem**: SSH key not configured

**Solution**:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Add this to GitHub: Settings → SSH and GPG keys → New SSH key
```

### Error: Repository not found

**Problem**: Repository doesn't exist on GitHub or wrong name

**Solution**:

- Verify repository exists on GitHub
- Check spelling of repository name
- Ensure you have access to the repository

### Error: Failed to push some refs

**Problem**: Remote has changes you don't have locally

**Solution**:

```bash
# If you're sure your local version is correct
git push -u origin main --force
```

### Error: Remote origin already exists

**Problem**: Git remote is already configured

**Solution**:

```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/REPO_NAME.git
```

---

## Verification Checklist

After pushing all repositories:

- [ ] All 4 repositories visible on GitHub
- [ ] README.md displays correctly in each repo
- [ ] `.env` files are NOT committed (check .gitignore working)
- [ ] Can clone each repository successfully
- [ ] GitHub Actions workflows are visible
- [ ] Branch protection rules configured (optional but recommended)
- [ ] Repository secrets added for CI/CD
- [ ] Collaborators added (if applicable)

---

## Next Steps After GitHub Setup

1. **Deploy Contracts**

   ```bash
   cd give-protocol-contracts
   # Configure .env
   npm run deploy:moonbase
   ```

2. **Update Contract Addresses**
   - Copy deployed addresses
   - Update `.env` in webapp and backend

3. **Deploy Webapp**
   - Import to Vercel/Netlify
   - Configure environment variables
   - Deploy

4. **Configure Backend**
   - Set up Supabase project
   - Run migrations
   - Deploy functions

5. **Deploy Docs**
   - GitHub Pages deploys automatically
   - Or configure custom domain

See **MIGRATION-GUIDE.md** for complete deployment instructions.
