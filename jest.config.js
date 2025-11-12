export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  testMatch: ['<rootDir>/tests/**/*.jsx'],
  extensionsToTreatAsEsm: ['.jsx'],  // Only .jsx since .js is auto-inferred
  moduleNameMapper: {  // Fixed typo: moduleNameMapping → moduleNameMapper
    '^(\\.{1,2}/.*)\\.jsx?$': '$1'
  }
};
