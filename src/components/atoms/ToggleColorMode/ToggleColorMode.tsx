import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

export default function ToggleColorMode() {
    const { toggleColorMode, colorMode, keyColors } = useColorMode()
    return (
        <ClientOnly fallback={<Skeleton boxSize="9" />}>
            <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
                size="sm"
                color={keyColors.primary}
                _hover={{ bg: keyColors.subtle }}
                css={{
                    _icon: {
                        width: '5',
                        height: '5',
                    },
                }}
            >
                {colorMode === 'dark' ? <LuMoon /> : <LuSun />}
            </IconButton>
        </ClientOnly>
    )
}
