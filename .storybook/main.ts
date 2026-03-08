import type { StorybookConfig } from '@storybook/nextjs-vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@chromatic-com/storybook',
        '@storybook/addon-vitest',
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
        '@storybook/addon-themes',
        '@storybook/addon-onboarding',
    ],
    framework: '@storybook/nextjs-vite',
    staticDirs: ['../public'],
    viteFinal: (config) => {
        config.resolve = config.resolve ?? {}
        config.resolve.alias = {
            ...config.resolve.alias,
            '@stytch/react': path.resolve(__dirname, '../src/__mocks__/@stytch/react.tsx'),
        }
        return config
    },
}
export default config
