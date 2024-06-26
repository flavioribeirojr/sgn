/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^config/(.*)$': '<rootDir>/config/$1',
    '^db/(.*)$': '<rootDir>/db/$1',
    '^cache/(.*)$': '<rootDir>/cache/$1',
    '^mail/(.*)$': '<rootDir>/mail/$1',
  },
  globalSetup: './tests/setup.ts',
  globalTeardown: './tests/teardown.ts',
}