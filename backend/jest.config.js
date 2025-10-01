export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "routes/**/*.js",
    "controllers/**/*.js",
    "utils/**/*.js"
  ]
};
