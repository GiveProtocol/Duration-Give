/**
 * Mock script to create test scheduled donations data
 * This bypasses smart contract deployment and creates mock data for testing the UI
 */

const fs = require('fs');
const path = require('path');

// Mock scheduled donations data
const mockScheduledDonations = [
  {
    id: 1,
    donor: "0x742d35Cc6Aa45832D8F7a9B6b4d4CF37cF90A9f5", // Mock donor address
    charity: "0x1234567890123456789012345678901234567890",
    charityName: "Clean Water Initiative",
    token: "0xMockTokenAddress",
    tokenSymbol: "TEST",
    totalAmount: "120.0",
    amountPerMonth: "10.0",
    monthsRemaining: 8,
    nextDistribution: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    active: true,
    created: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000) // 120 days ago
  },
  {
    id: 2,
    donor: "0x742d35Cc6Aa45832D8F7a9B6b4d4CF37cF90A9f5", // Same donor
    charity: "0x2345678901234567890123456789012345678901",
    charityName: "Education for All Foundation",
    token: "0xMockTokenAddress",
    tokenSymbol: "TEST", 
    totalAmount: "360.0",
    amountPerMonth: "30.0",
    monthsRemaining: 5,
    nextDistribution: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    active: true,
    created: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000) // 210 days ago
  }
];

/**
 * Creates a hook override that returns mock data instead of calling the blockchain
 */
function createMockHookOverride() {
  const mockHookCode = `// TEMPORARY MOCK OVERRIDE - REMOVE FOR PRODUCTION
// This file overrides the useScheduledDonation hook to return mock data for testing

import { useState, useCallback } from "react";
import { Logger } from "@/utils/logger";

interface ScheduleParams {
  charityAddress: string;
  tokenAddress: string;
  totalAmount: string;
}

interface DonorSchedule {
  id: number;
  charity: string;
  token: string;
  totalAmount: string;
  amountPerMonth: string;
  monthsRemaining: number;
  nextDistribution: Date;
  active: boolean;
}

// Mock data for testing
const MOCK_SCHEDULES: DonorSchedule[] = ${JSON.stringify(mockScheduledDonations.map(schedule => ({
  id: schedule.id,
  charity: schedule.charity,
  token: schedule.token,
  totalAmount: schedule.totalAmount,
  amountPerMonth: schedule.amountPerMonth,
  monthsRemaining: schedule.monthsRemaining,
  nextDistribution: schedule.nextDistribution,
  active: schedule.active
})), null, 2)};

export function useScheduledDonation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = useCallback(async ({
    charityAddress,
    tokenAddress,
    totalAmount,
  }: ScheduleParams) => {
    setLoading(true);
    setError(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    Logger.info("Mock schedule created", { charityAddress, tokenAddress, totalAmount });
    
    // Return mock transaction hash
    return "0x123456789abcdef...";
  }, []);

  const cancelSchedule = useCallback(async (scheduleId: number) => {
    setLoading(true);
    setError(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    Logger.info("Mock schedule cancelled", { scheduleId });
    
    // Return mock transaction hash
    return "0xabcdef123456789...";
  }, []);

  const getDonorSchedules = useCallback(async (): Promise<DonorSchedule[]> => {
    setLoading(true);
    setError(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    Logger.info("Retrieved mock scheduled donations", { count: MOCK_SCHEDULES.length });
    
    return MOCK_SCHEDULES;
  }, []);

  return {
    createSchedule,
    cancelSchedule,
    getDonorSchedules,
    loading,
    error,
  };
}`;

  return mockHookCode;
}

async function main() {
  console.log("🧪 Creating mock scheduled donations for testing...");

  // Create the mock hook override
  const mockHookPath = path.join(__dirname, "..", "src", "hooks", "web3", "useScheduledDonation.mock.ts");
  const originalHookPath = path.join(__dirname, "..", "src", "hooks", "web3", "useScheduledDonation.ts");
  const backupHookPath = path.join(__dirname, "..", "src", "hooks", "web3", "useScheduledDonation.original.ts");
  
  try {
    // Create backup of original hook
    if (fs.existsSync(originalHookPath)) {
      fs.copyFileSync(originalHookPath, backupHookPath);
      console.log("✅ Created backup of original hook");
    }

    // Write mock hook
    fs.writeFileSync(mockHookPath, createMockHookOverride());
    console.log("✅ Created mock hook override");

    // Replace original hook with mock
    fs.writeFileSync(originalHookPath, createMockHookOverride());
    console.log("✅ Replaced hook with mock version");

    console.log("\n📊 Mock Scheduled Donations Created:");
    mockScheduledDonations.forEach((schedule, index) => {
      console.log(`\nSchedule ${index + 1}:`);
      console.log(`  - Charity: ${schedule.charityName} (${schedule.charity})`);
      console.log(`  - Total: ${schedule.totalAmount} ${schedule.tokenSymbol}`);
      console.log(`  - Monthly: ${schedule.amountPerMonth} ${schedule.tokenSymbol}`);
      console.log(`  - Remaining: ${schedule.monthsRemaining} months`);
      console.log(`  - Next Distribution: ${schedule.nextDistribution.toDateString()}`);
    });

    console.log(`\n✨ Mock data setup complete!`);
    console.log(`\nTo test:`);
    console.log(`1. Start the development server: npm run dev`);
    console.log(`2. Navigate to http://localhost:5173/scheduled-donations`);
    console.log(`3. Connect any wallet to see the mock scheduled donations`);
    console.log(`\nTo restore original functionality:`);
    console.log(`1. Run: cp src/hooks/web3/useScheduledDonation.original.ts src/hooks/web3/useScheduledDonation.ts`);
    console.log(`2. Delete the .mock.ts file`);

  } catch (error) {
    console.error("❌ Error creating mock data:", error);
    throw error;
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log("\n✅ Mock setup completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Mock setup failed:", error);
      process.exit(1);
    });
}

module.exports = { main };