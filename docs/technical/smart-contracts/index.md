---
layout: modern
title: "Smart Contract Interactions"
description: "Learn how to interact with Give Protocol's smart contracts for donations, verification, and more"
---

# Smart Contract Interactions

Understanding how to interact with Give Protocol's smart contracts for building integrations and custom applications.

## Core Smart Contracts

### DurationDonation Contract

The main contract handling all donation operations:

```solidity
// Basic donation function
function donate(
    address charity,
    address token,
    uint256 amount,
    string memory message
) external payable;

// Scheduled donation setup
function createScheduledDonation(
    address charity,
    address token,
    uint256 totalAmount,
    uint256 frequency,
    uint256 duration
) external;
```

### VolunteerVerification Contract

Manages volunteer hour verification and NFT rewards:

```solidity
// Submit volunteer hours for verification
function submitVolunteerHours(
    address charity,
    uint256 hours,
    string memory description,
    bytes32 proofHash
) external;

// Verify and mint NFT reward
function verifyAndReward(
    uint256 submissionId,
    address volunteer,
    uint256 hours
) external onlyVerifier;
```

## Integration Examples

### Web3.js Integration

```javascript
const Web3 = require("web3");
const DurationDonationABI = require("./DurationDonation.json");

const web3 = new Web3("https://rpc.api.moonbeam.network");
const contract = new web3.eth.Contract(
  DurationDonationABI.abi,
  "0x...", // Contract address
);

// Make a donation
async function makeDonation(from, charity, amount) {
  const tx = await contract.methods
    .donate(charity, "0x0", amount, "One-time donation")
    .send({ from, value: amount });

  return tx.transactionHash;
}
```

### Ethers.js Integration

```javascript
const { ethers } = require("ethers");
const DurationDonationABI = require("./DurationDonation.json");

const provider = new ethers.JsonRpcProvider("https://rpc.api.moonbeam.network");
const contract = new ethers.Contract(
  "0x...", // Contract address
  DurationDonationABI.abi,
  provider,
);

// Listen for donation events
contract.on("DonationMade", (donor, charity, amount, event) => {
  console.log(`Donation: ${donor} → ${charity}: ${amount} GLMR`);
});
```

## Event Monitoring

### Key Events

```solidity
// Donation events
event DonationMade(
    address indexed donor,
    address indexed charity,
    uint256 amount,
    address token,
    string message
);

// Verification events
event VolunteerHoursSubmitted(
    address indexed volunteer,
    address indexed charity,
    uint256 hours,
    uint256 submissionId
);

event VolunteerHoursVerified(
    uint256 indexed submissionId,
    address indexed volunteer,
    uint256 hours,
    uint256 nftTokenId
);
```

### Event Filtering

```javascript
// Filter donations to specific charity
const filter = contract.filters.DonationMade(null, charityAddress);
const events = await contract.queryFilter(filter, fromBlock, toBlock);

// Real-time event listening
contract.on(filter, (donor, charity, amount, token, message, event) => {
  // Handle new donation
});
```

## Error Handling

### Common Errors

```solidity
// Custom error types
error InsufficientBalance(uint256 required, uint256 available);
error UnauthorizedVerifier(address caller);
error InvalidCharityAddress(address charity);
error ExceedsMaxDonation(uint256 amount, uint256 max);
```

### Error Handling in JavaScript

```javascript
try {
  const tx = await contract.donate(charity, token, amount, message);
  await tx.wait();
} catch (error) {
  if (error.reason === "InsufficientBalance") {
    // Handle insufficient balance
  } else if (error.reason === "InvalidCharityAddress") {
    // Handle invalid charity
  } else {
    // Handle generic error
  }
}
```

## Gas Optimization

### Batch Operations

```solidity
// Batch multiple donations
function batchDonate(
    DonationData[] calldata donations
) external payable {
    for (uint i = 0; i < donations.length; i++) {
        _processDonation(donations[i]);
    }
}
```

### Gas Estimation

```javascript
// Estimate gas before transaction
const gasEstimate = await contract.estimateGas.donate(
  charity,
  token,
  amount,
  message,
);

// Add 20% buffer for safety
const gasLimit = gasEstimate.mul(120).div(100);

const tx = await contract.donate(charity, token, amount, message, {
  gasLimit,
});
```

## Security Best Practices

### Input Validation

- Always validate addresses before contract calls
- Check token approvals before transfers
- Verify amounts are within acceptable ranges
- Sanitize string inputs to prevent injection

### Transaction Safety

- Use proper error handling for all transactions
- Implement transaction retry logic with exponential backoff
- Monitor for failed transactions and handle appropriately
- Use multicall patterns for complex operations

### Access Control

- Implement proper role-based access control
- Use time locks for sensitive operations
- Require multiple signatures for large transactions
- Regular security audits and updates

## Testing

### Unit Tests

```javascript
describe("DurationDonation", function () {
  it("should process donation correctly", async function () {
    const tx = await contract.donate(
      charity.address,
      ethers.constants.AddressZero,
      ethers.utils.parseEther("1.0"),
      "Test donation",
    );

    expect(tx).to.emit(contract, "DonationMade");
  });
});
```

### Integration Tests

```javascript
// Test full donation flow
it("should complete end-to-end donation", async function () {
  // 1. Approve tokens if needed
  // 2. Make donation
  // 3. Verify events emitted
  // 4. Check balances updated
  // 5. Confirm charity received funds
});
```

## Need Help?

Visit our [API Documentation](/technical/api-docs/) for REST API details or check out the [blockchain integration guide](/technical/blockchain-integration/) for more context.
