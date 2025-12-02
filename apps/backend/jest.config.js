/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': [
      'ts-jest',
      {
        useESM: false,
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.pnpm/)?jose)',
    '<rootDir>/../node_modules/(?!(.*\\.pnpm/)?jose)',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/../node_modules'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/*.types.ts', '!src/server.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
  forceExit: true,
  clearMocks: false,
  resetMocks: false,
  restoreMocks: false,
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup/global.ts'],
  maxWorkers: 1,
};
