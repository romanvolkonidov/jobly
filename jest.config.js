const jestConfig = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest", // Use babel-jest to transform TypeScript and JavaScript
  },
  testEnvironment: "jsdom", // Use jsdom for React testing
  extensionsToTreatAsEsm: [".ts", ".tsx", ".js", ".jsx"], // Treat these extensions as ES modules
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS modules
  }};

export default jestConfig;
