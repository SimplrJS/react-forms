 "dependencies": {
        "@types/node": "11.11.3",
        "react": "16.8.4",
        "react-dom": "16.8.4",
        "tslib": "1.9.3"
    },
    "devDependencies": {
        "@babel/core": "7.3.4",
        "@types/jest": "24.0.11",
        "@types/react": "16.8.8",
        "@types/react-dom": "16.8.2",
        "@types/webpack": "4.4.25",
        "babel-loader": "8.0.5",
        "babel-preset-react-app": "7.0.2",
        "cross-env": "5.2.0",
        "html-webpack-plugin": "3.2.0",
        "html-webpack-root-plugin": "0.10.0",
        "istanbul-azure-reporter": "0.1.4",
        "jest": "24.5.0",
        "jest-dom": "3.1.3",
        "jest-junit": "6.3.0",
        "react-testing-library": "6.0.0",
        "simplr-tslint": "1.0.0-alpha.14",
        "source-map-loader": "0.2.4",
        "ts-jest": "24.0.0",
        "tslint": "5.14.0",
        "typescript": "3.4.0-rc",
        "webpack": "4.29.6",
        "webpack-cli": "3.3.0",
        "webpack-dev-server": "3.2.1"
    },
    "jest": {
        "verbose": true,
        "preset": "ts-jest",
        "reporters": [
            "default",
            "jest-junit"
        ],
        "collectCoverage": true,
        "testRegex": "/__tests__/.*\\.(test|spec).(ts|tsx|js)$",
        "collectCoverageFrom": [
            "src/**/*.{ts,tsx}",
            "!src/index.ts"
        ],
        "coverageReporters": [
            "cobertura",
            "istanbul-azure-reporter"
        ]
    }
