import Toaster from '../src/components/atoms/Toaster/Toaster'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import { ThemeProvider, useTheme } from 'next-themes'
import { useEffect } from 'react'
import '@fontsource/inter'

/**
 * Syncs the Storybook toolbar theme selection into next-themes by calling
 * setTheme whenever the toolbar value changes. Rendered inside ThemeProvider
 * so it has access to the context. This allows:
 *  - The toolbar to control the theme for any story (without forcedTheme locking it)
 *  - The ToggleColorMode button to still call setTheme freely
 */
function StorybookThemeSync({ theme }: { theme: string }) {
    const { setTheme } = useTheme()
    useEffect(() => {
        setTheme(theme)
    }, [theme])
    return null
}

const preview: Preview = {
    decorators: [
        // Apply the class-based theme wrapper so Storybook's toolbar UI
        // reflects the selected theme. StorybookThemeSync (below) ensures
        // next-themes internal state stays in sync with the toolbar selection.
        withThemeByClassName({
            defaultTheme: 'light',
            themes: { light: '', dark: 'dark' },
        }),
        (Story, context) => {
            const sbTheme = context?.globals?.theme === 'dark' ? 'dark' : 'light'
            return (
                <ChakraProvider value={defaultSystem}>
                    <ThemeProvider attribute="class" disableTransitionOnChange>
                        {/* Sync toolbar → next-themes without locking it via forcedTheme */}
                        <StorybookThemeSync theme={sbTheme} />
                        <Story />
                        <Toaster />
                    </ThemeProvider>
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
