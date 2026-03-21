import type { StorybookConfig } from '@storybook/nextjs-vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
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
            'next/navigation': require.resolve('@storybook/nextjs-vite/navigation.mock'),
        }
        return config
    },
}
export default config
