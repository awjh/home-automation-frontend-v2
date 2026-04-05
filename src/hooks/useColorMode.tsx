import ColorMode from '@defs/ColorMode'
import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'

interface UseColorModeReturn {
    colorMode: ColorMode
    keyColors: {
        primary: string
        buttonHoverBg: string
        secondary: string
        subtle: string
        lessSubtle: string
    }
    setColorMode: (colorMode: ColorMode) => void
    toggleColorMode: () => void
}

export default function useColorMode(): UseColorModeReturn {
    const { resolvedTheme, setTheme, forcedTheme } = useTheme()

    // useSyncExternalStore returns getServerSnapshot() on the server and during
    // the initial hydration pass, then switches to getSnapshot() after the
    // client has committed its first render — exactly what we need to avoid
    // SSR/client mismatches without useEffect + setState.
    const mounted = useSyncExternalStore(
        () => () => {}, // no external store to subscribe to
        () => true, // client snapshot: mounted
        () => false, // server snapshot: not mounted
    )

    // Before the component has mounted on the client we must not read the
    // resolved theme, because the server doesn't know the user's preference.
    // Using a fixed default here ensures the SSR HTML and the initial client
    // render agree, preventing React hydration mismatches.
    let colorMode: ColorMode | undefined

    if (mounted) {
        // Prefer forcedTheme (explicit), then resolvedTheme from next-themes.
        // In Storybook we also support the class-based storybook theme toggle
        // (which sets a `dark` class on the document) — next-themes may not
        // always be driving that change, so fall back to reading the document
        // class if neither forcedTheme nor resolvedTheme are available.
        colorMode = (forcedTheme || resolvedTheme) as ColorMode | undefined

        if (!colorMode && typeof document !== 'undefined') {
            colorMode = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        }
    }

    if (!colorMode) {
        // SSR / pre-mount default — must match what the server renders.
        colorMode = 'light'
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
            lessSubtle: colorMode === 'dark' ? 'teal.700' : 'teal.200',
        },
        setColorMode: setTheme,
        toggleColorMode,
    }
}
