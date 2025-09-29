const { ethers } = require("ethers");
require("dotenv").config();

function getWalletAddress() {
  try {
    let privateKey = process.env.PRIVATE_KEY;

    // Add 0x prefix if missing
    if (!privateKey.startsWith("0x")) {
      privateKey = `0x${privateKey}`;
    }

    const wallet = new ethers.Wallet(privateKey);
    console.log("\n🔑 Wallet Information:");
    console.log("Address:", wallet.address);
    console.log("\n📋 Next steps:");
    console.log("1. Visit: https://faucet.moonbeam.network/");
    console.log("2. Enter your address:", wallet.address);
    console.log("3. Request test DEV tokens");
    console.log("4. Wait for confirmation (usually takes 10-30 seconds)");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n⚠️  Make sure your PRIVATE_KEY in .env is valid");
    console.log(
      "It should be 64 hexadecimal characters (with or without 0x prefix)",
    );
  }
}

getWalletAddress();
