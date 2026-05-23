import webpackPreprocessor from '@cypress/webpack-preprocessor'
import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'cypress'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

loadEnvConfig(process.cwd())

const webpackOptions = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
        plugins: [new TsconfigPathsPlugin()],
    },
}

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.cy.ts',
        supportFile: 'cypress/support/e2e.ts',
        setupNodeEvents(on) {
            on('file:preprocessor', webpackPreprocessor({ webpackOptions }))
        },
    },
    env: {
        API_BASE_URL: process.env.API_BASE_URL,
        API_KEY: process.env.API_KEY,
        CYPRESS_USER: process.env.CYPRESS_USER,
        CYPRESS_USER_PASSWORD: process.env.CYPRESS_USER_PASSWORD,
    },
    video: false,
    viewportWidth: 1280,
    viewportHeight: 900,
})
