/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(scss|sass|css)$': '<rootDir>/style.mock.js',
    },
};

