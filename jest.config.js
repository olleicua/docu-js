export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  testMatch: ['<rootDir>/tests/**/*.jsx'],
  setupFilesAfterEnv: ["<rootDir>/test-setup.js"],
  extensionsToTreatAsEsm: ['.jsx'],  // Only .jsx since .js is auto-inferred
  moduleNameMapper: {  // Fixed typo: moduleNameMapping → moduleNameMapper
    '^(\\.{1,2}/.*)\\.jsx?$': '$1'
  }
};
