export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.app.json",
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$))"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/utils/cn.ts",
    "src/utils/validation.ts",
    "src/utils/errors.ts",
    "src/utils/inputValidation.ts",
    "src/utils/performance/caching.ts",
    "src/types/charity.ts",
    "src/types/volunteer.ts",
    "src/data/charities.ts",
    "src/styles/colors.ts",
    "src/i18n/resources/*.ts",
    "src/components/ui/Tabs.tsx",
    "src/components/ui/Editor.tsx",
    "src/components/web3/ConnectButton.tsx",
    "src/components/donor/DonationHistory.tsx",
    "src/components/donor/ScheduledDonations.tsx",
    "src/components/settings/WalletAliasSettings.tsx",
    "src/components/volunteer/ApplicationAcceptance.tsx",
    "src/components/volunteer/VolunteerHoursVerification.tsx",
  ],
  coverageReporters: ["text", "lcov", "html"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{ts,tsx}",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/contracts/",
    "<rootDir>/scripts/",
  ],
};
