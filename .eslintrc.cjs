module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier",
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                ".eslintrc.{js,cjs}",
                "functions/**/*.ts",
                "functions/**/*.js",
            ],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "react"],
    rules: {
        indent: "off",
        "linebreak-style": ["error", "unix"],
        quotes: ["off"],
        semi: ["error", "always"],
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/ban-ts-comment": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
