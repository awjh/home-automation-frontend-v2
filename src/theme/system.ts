import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

// Colours are resolved by CSS (via the `dark` class next-themes sets on <html> before first
// paint) rather than in JS, so server-rendered HTML is correct for both modes without flicker
const config = defineConfig({
    theme: {
        semanticTokens: {
            colors: {
                key: {
                    primary: { value: { base: '{colors.teal.600}', _dark: '{colors.teal.400}' } },
                    buttonHoverBg: {
                        value: { base: '{colors.teal.500}', _dark: '{colors.teal.200}' },
                    },
                    secondary: { value: { base: '{colors.white}', _dark: '{colors.black}' } },
                    subtle: { value: { base: '{colors.teal.100}', _dark: '{colors.teal.800}' } },
                    lessSubtle: {
                        value: { base: '{colors.teal.200}', _dark: '{colors.teal.700}' },
                    },
                },
            },
        },
    },
})

const system = createSystem(defaultConfig, config)

export default system
