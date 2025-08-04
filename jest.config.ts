export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.app.json'
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/utils/cn.ts',
    'src/utils/validation.ts',
    'src/utils/errors.ts',
    'src/utils/inputValidation.ts',
    'src/utils/performance/caching.ts',
    'src/utils/env.ts',
    'src/utils/volunteer.ts',
    'src/utils/money.ts',
    'src/utils/date.ts',
    'src/test-utils/authTestHelpers.ts',
    'src/test-utils/jestSetup.ts',
    'src/test-utils/mockSetup.tsx',
    'src/test-utils/routeMocks.ts',
    'src/test-utils/supabaseMocks.ts',
    'src/test-utils/templates.ts',
    'src/test-utils/testHelpers.ts',
    'src/test-utils/types.ts',
    'src/test-utils/validationTestData.ts',
    'src/types/charity.ts',
    'src/types/volunteer.ts',
    'src/data/charities.ts',
    'src/styles/colors.ts',
    'src/i18n/resources/*.ts',
    'src/components/ui/Tabs.tsx',
    'src/components/ui/Editor.tsx',
    'src/components/web3/ConnectButton.tsx',
    'src/components/donor/DonationHistory.tsx',
    'src/components/donor/ScheduledDonations.tsx',
    'src/components/settings/WalletAliasSettings.tsx',
    'src/components/volunteer/ApplicationAcceptance.tsx',
    'src/components/volunteer/VolunteerHoursVerification.tsx'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/contracts/',
    '<rootDir>/scripts/'
  ]
};