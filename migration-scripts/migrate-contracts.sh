#!/bin/bash

# Migrate smart contracts to give-protocol-contracts repository

set -e

SOURCE_DIR="/home/drigo/projects/Duration"
TARGET_DIR="/home/drigo/projects/give-protocol-contracts"

echo "Creating give-protocol-contracts repository..."

# Create target directory
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

# Initialize git if not exists
if [ ! -d ".git" ]; then
    git init
    echo "Git repository initialized"
fi

# Copy contract files
echo "Copying smart contracts..."
mkdir -p contracts
cp -r "$SOURCE_DIR/contracts/"* contracts/

# Copy contract-related configurations
echo "Copying Hardhat configuration..."
cp "$SOURCE_DIR/hardhat.config.cjs" .

# Copy deployment scripts
echo "Copying deployment scripts..."
mkdir -p scripts
if [ -d "$SOURCE_DIR/scripts" ]; then
    cp "$SOURCE_DIR/scripts/deploy"*.ts scripts/ 2>/dev/null || true
    cp "$SOURCE_DIR/scripts/deploy"*.js scripts/ 2>/dev/null || true
fi

# Copy test files
echo "Copying contract tests..."
mkdir -p test
if [ -d "$SOURCE_DIR/test" ]; then
    cp -r "$SOURCE_DIR/test/"* test/ 2>/dev/null || true
fi

# Copy artifacts and cache directories
echo "Copying build artifacts..."
if [ -d "$SOURCE_DIR/artifacts" ]; then
    cp -r "$SOURCE_DIR/artifacts" .
fi
if [ -d "$SOURCE_DIR/cache" ]; then
    cp -r "$SOURCE_DIR/cache" .
fi
if [ -d "$SOURCE_DIR/deployments" ]; then
    cp -r "$SOURCE_DIR/deployments" .
fi

# Copy configuration files
echo "Copying configuration files..."
cp "$SOURCE_DIR/.solhint.json" . 2>/dev/null || true
cp "$SOURCE_DIR/.fuzz.yml" . 2>/dev/null || true
cp "$SOURCE_DIR/.scribble-arming.meta.json" . 2>/dev/null || true
cp "$SOURCE_DIR/tsconfig.hardhat.json" . 2>/dev/null || true

# Copy documentation
echo "Copying contract documentation..."
cp "$SOURCE_DIR/DEPLOY_TO_MOONBASE.md" . 2>/dev/null || true
cp "$SOURCE_DIR/FUZZING.md" . 2>/dev/null || true
cp "$SOURCE_DIR/SECURITY.md" . 2>/dev/null || true

# Create package.json for contracts
echo "Creating package.json..."
cat > package.json <<'EOF'
{
  "name": "give-protocol-contracts",
  "version": "1.0.0",
  "description": "Smart contracts for Give Protocol - blockchain-based charitable giving platform",
  "private": true,
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "deploy:moonbase": "hardhat run scripts/deploy.ts --network moonbase",
    "deploy:verification": "hardhat run scripts/deploy-verification.ts --network moonbase",
    "deploy:distribution": "hardhat run scripts/deploy-distribution.ts --network moonbase",
    "node": "hardhat node",
    "lint:sol": "solhint 'contracts/**/*.sol'",
    "fuzz:arm": "~/.local/bin/fuzz arm",
    "fuzz:run": "~/.local/bin/fuzz run",
    "fuzz:disarm": "~/.local/bin/fuzz disarm"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-chai-matchers": "^2.0.9",
    "@nomicfoundation/hardhat-ethers": "^3.0.9",
    "@nomicfoundation/hardhat-network-helpers": "^1.0.13",
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "@nomicfoundation/hardhat-verify": "^2.0.14",
    "@typechain/ethers-v6": "^0.5.1",
    "@typechain/hardhat": "^9.1.0",
    "@types/chai": "^4.3.20",
    "@types/mocha": "^10.0.10",
    "@types/node": "^20.11.24",
    "dotenv": "^16.4.7",
    "eth-scribble": "^0.7.10",
    "ethers": "^6.14.0",
    "hardhat": "^2.26.3",
    "hardhat-gas-reporter": "^1.0.10",
    "solhint": "^5.2.0",
    "solidity-coverage": "^0.8.16",
    "ts-node": "^10.9.2",
    "typechain": "^8.3.2",
    "typescript": "^5.3.3"
  },
  "dependencies": {
    "@chainlink/contracts": "^1.4.0",
    "@openzeppelin/contracts": "^5.4.0"
  }
}
EOF

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore <<'EOF'
node_modules
.env
coverage
coverage.json
typechain
typechain-types

# Hardhat files
cache
artifacts

# Build outputs
dist
build

# IDE
.idea
.vscode
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF

# Create README.md
echo "Creating README.md..."
cat > README.md <<'EOF'
# Give Protocol - Smart Contracts

Smart contracts for Give Protocol, a blockchain-based charitable giving platform built on Moonbeam Network.

## Contracts

- **DurationDonation.sol** - Main donation contract for direct giving
- **PortfolioFunds.sol** - Portfolio management for charitable endowment and impact funds
- **CharityScheduledDistribution.sol** - Automated scheduled distributions to charities
- **DistributionExecutor.sol** - Executor contract for managing distributions
- **VolunteerVerification.sol** - Volunteer verification and management

## Setup

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```
MOONBASE_RPC_URL=
PRIVATE_KEY=
MOONSCAN_API_KEY=
```

## Development

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Check coverage
npm run test:coverage

# Lint contracts
npm run lint:sol
```

## Deployment

```bash
# Deploy to Moonbase Alpha testnet
npm run deploy:moonbase
```

## Security

- All contracts use OpenZeppelin libraries
- Fuzzing tests available via Scribble
- See SECURITY.md for security policies

## License

UNLICENSED - Private Repository
EOF

# Create .env.example
echo "Creating .env.example..."
cat > .env.example <<'EOF'
# Moonbeam Network
MOONBASE_RPC_URL=https://rpc.api.moonbase.moonbeam.network
MOONBEAM_RPC_URL=

# Private Keys (NEVER COMMIT THESE!)
PRIVATE_KEY=

# Block Explorers
MOONSCAN_API_KEY=

# Gas Reporter
COINMARKETCAP_API_KEY=
EOF

echo "✓ give-protocol-contracts repository created successfully at $TARGET_DIR"
