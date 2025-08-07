/**
 * Admin Setup Script
 *
 * This script allows you to grant admin privileges to existing users.
 * Run with: npx tsx scripts/setup-admin.ts
 *
 * Note: This script now uses proper error handling with throw statements
 * and process.exitCode instead of direct process.exit() calls
 */

import { createClient } from "@supabase/supabase-js";
import * as readline from "readline/promises";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

// Validate environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing required environment variables");
  console.error("Please ensure the following are set in your .env file:");
  console.error("- VITE_SUPABASE_URL");
  console.error(
    "- SUPABASE_SERVICE_ROLE_KEY (get this from Supabase dashboard > Settings > API)",
  );
  process.exitCode = 1;
  throw new Error("Missing required environment variables");
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Custom error class for admin setup operations
 * @class AdminSetupError
 * @extends Error
 */
class AdminSetupError extends Error {
  constructor(message: string, public exitCode: number = 1) {
    super(message);
    this.name = 'AdminSetupError';
  }
}

/**
 * Custom error class for user-cancelled operations
 * @class UserCancelledError
 * @extends Error
 */
class UserCancelledError extends Error {
  constructor(message = 'Operation cancelled by user') {
    super(message);
    this.name = 'UserCancelledError';
  }
}

async function setupAdmin() {
  console.log("🛡️  Give Protocol Admin Setup Tool");
  console.log("==================================\n");

  try {
    // Get user email
    const email = await rl.question(
      "Enter the email address of the user to make admin: ",
    );

    if (!email || !email.includes("@")) {
      console.error("❌ Invalid email address");
      throw new AdminSetupError("Invalid email address");
    }

    console.log(`\nSearching for user with email: ${email}...`);

    // First, find the user in auth.users table
    const { data: authUser, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("❌ Error accessing auth users:", authError.message);
      throw new AdminSetupError(`Error accessing auth users: ${authError.message}`);
    }

    const user = authUser.users.find((u) => u.email === email);

    if (!user) {
      console.error("❌ User not found in auth.users table.");
      throw new AdminSetupError("User not found in auth.users table.");
    }

    // Now find their profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      console.error(
        "❌ Profile not found. Make sure the user has completed registration.",
      );
      console.error("Error details:", profileError?.message);
      throw new AdminSetupError("Profile not found. User may not have completed registration.");
    }

    const users = profile;

    // Show current user info
    console.log("\n✅ User found!");
    console.log(`Profile ID: ${users.id}`);
    console.log(`User ID: ${users.user_id}`);
    console.log(`Current Type: ${users.type}`);
    console.log(`Created: ${new Date(users.created_at).toLocaleString()}`);

    if (users.type === "admin") {
      console.log("\n⚠️  This user is already an admin!");
      const proceed = await rl.question(
        "Do you want to continue anyway? (y/N): ",
      );
      if (proceed.toLowerCase() !== "y") {
        console.log("Operation cancelled.");
        throw new UserCancelledError();
      }
    }

    // Confirm action
    console.log(
      "\n⚠️  WARNING: This will grant full admin privileges to this user!",
    );
    const confirm = await rl.question(
      "Are you sure you want to proceed? (y/N): ",
    );

    if (confirm.toLowerCase() !== "y") {
      console.log("Operation cancelled.");
      throw new UserCancelledError();
    }

    // Update user profile to admin
    console.log("\nUpdating user profile...");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ type: "admin" })
      .eq("user_id", users.user_id);

    if (updateError) {
      console.error("❌ Failed to update profile:", updateError.message);
      throw new AdminSetupError(`Failed to update profile: ${updateError.message}`);
    }

    console.log("\n✅ Success! User has been granted admin privileges.");
    console.log("\nThe user can now access the admin panel at: /admin");
    console.log(
      "They may need to log out and log back in for the changes to take effect.",
    );
  } catch (error) {
    console.error("❌ An unexpected error occurred:", error);
    throw new AdminSetupError(`An unexpected error occurred: ${error}`);
  } finally {
    rl.close();
  }
}

// Main execution with proper error handling
async function main() {
  try {
    await setupAdmin();
  } catch (error) {
    if (error instanceof UserCancelledError) {
      // User cancellation is not an error, exit cleanly
      process.exitCode = 0;
    } else if (error instanceof AdminSetupError) {
      // Admin setup errors should exit with error code
      process.exitCode = error.exitCode;
    } else {
      // Unexpected errors
      process.exitCode = 1;
    }
    // Error messages are already logged by the throwing functions
  }
}

// Run the setup
main();
