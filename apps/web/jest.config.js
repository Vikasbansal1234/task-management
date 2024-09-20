module.exports = {
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Ensuring Babel is used for transformations
    },
    transformIgnorePatterns: [
        "/node_modules/(?!axios).+\\.js$" // Specifically transform axios, ignore other JS in node_modules
    ],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [
        '<rootDir>/src/setupTests.js' // Ensure your setupTests.js is correctly loaded
    ],
};

