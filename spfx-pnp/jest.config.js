module.exports = {
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    coveragePathIgnorePatterns: [
        "node_modules/(?!(@microsoft/*|@microsoft/sp-http|))"
    ],
    testRegex: [
        '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$'
    ],
    testEnvironment: "jsdom",
    moduleNameMapper:{
        "\\.(css|scss)$": "identity-obj-proxy"
    }
};