export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  collectCoverage: true, 
  coverageDirectory: "coverage", 
  coverageReporters: ["text", "lcov"], 
  collectCoverageFrom: [
    "routes/**/*.js",
    "controllers/**/*.js",
    "utils/**/*.js",
    "!**/node_modules/**",
    "!**/tests/**" 
  ]
};
