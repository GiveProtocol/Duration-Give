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
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          module: "commonjs",
          target: "es2020",
          moduleResolution: "node",
          skipLibCheck: true,
          resolveJsonModule: true,
        },
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
    "src/types/charity.ts",
    "src/types/volunteer.ts",
    "src/data/charities.ts",
    "src/styles/colors.ts",
    "src/i18n/resources/*.ts",
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
