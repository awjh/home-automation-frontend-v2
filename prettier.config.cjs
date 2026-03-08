module.exports = {
    printWidth: 100,
    tabWidth: 4,
    useTabs: false,
    semi: false,
    singleQuote: true,
    quoteProps: 'as-needed',
    jsxSingleQuote: false,
    trailingComma: 'all',
    bracketSpacing: true,
    arrowParens: 'always',
    overrides: [
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '.editorconfig',
            options: { parser: 'yaml' },
        },
        {
            files: 'LICENSE',
            options: { parser: 'markdown' },
        },
    ],
}
