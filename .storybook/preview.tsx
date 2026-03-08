import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { StytchProvider } from '@stytch/react'

const preview: Preview = {
    decorators: [
        // Apply the class-based theme wrapper first so the document/class is
        // present before our Provider mounts and reads the theme.
        withThemeByClassName({
            defaultTheme: 'light',
            themes: { light: '', dark: 'dark' },
        }),
        // Pass Storybook's selected theme into our Provider so next-themes
        // sees the active theme as `forcedTheme`. The withThemeByClassName
        // decorator adds a `theme` global (keys from the `themes` map),
        // so read it from the context and forward it.
        (Story, context) => {
            const sbTheme = context?.globals?.theme
            // Normalize to 'dark' | 'light' (fallback to 'light')
            const forcedTheme = sbTheme === 'dark' ? 'dark' : 'light'
            return (
                <ChakraProvider value={defaultSystem}>
                    <StytchProvider>
                        <ThemeProvider
                            attribute="class"
                            disableTransitionOnChange
                            forcedTheme={forcedTheme}
                        >
                            <Story />
                        </ThemeProvider>
                    </StytchProvider>
                </ChakraProvider>
            )
        },
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },
        layout: 'fullscreen',
    },
}

export default preview
