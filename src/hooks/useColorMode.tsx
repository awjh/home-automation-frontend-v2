import ColorMode from '@defs/ColorMode'
import { useTheme } from 'next-themes'

interface UseColorModeReturn {
    colorMode: ColorMode
    keyColors: {
        primary: string
        buttonHoverBg: string
        secondary: string
        subtle: string
    }
    setColorMode: (colorMode: ColorMode) => void
    toggleColorMode: () => void
}

export default function useColorMode(): UseColorModeReturn {
    const { resolvedTheme, setTheme, forcedTheme } = useTheme()
    // Prefer forcedTheme (explicit), then resolvedTheme from next-themes.
    // In Storybook we also support the class-based storybook theme toggle
    // (which sets a `dark` class on the document) — next-themes may not
    // always be driving that change, so fall back to reading the document
    // class if neither forcedTheme nor resolvedTheme are available.
    let colorMode = (forcedTheme || resolvedTheme) as ColorMode | undefined

    if (!colorMode && typeof document !== 'undefined') {
        colorMode = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }

    const toggleColorMode = () => {
        // Toggle via next-themes when possible. If resolvedTheme is not
        // defined, toggle by setting the opposite class on the document —
        // this keeps Storybook's class-based toggle working too.
        if (typeof resolvedTheme === 'string') {
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            return
        }

        if (typeof document !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark')
            document.documentElement.classList.toggle('dark', !isDark)
        }
    }
    return {
        colorMode: colorMode as ColorMode,
        keyColors: {
            primary: colorMode === 'dark' ? 'teal.400' : 'teal.600',
            buttonHoverBg: colorMode === 'dark' ? 'teal.200' : 'teal.500',
            secondary: colorMode === 'dark' ? 'black' : 'white',
            subtle: colorMode === 'dark' ? 'teal.800' : 'teal.100',
        },
        setColorMode: setTheme,
        toggleColorMode,
    }
}
