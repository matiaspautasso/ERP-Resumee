/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.integration.spec.ts'],
  moduleNameMapper: {
    '^@erp/shared$': '<rootDir>/../../packages/shared/src/index.ts',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 120000,
};
