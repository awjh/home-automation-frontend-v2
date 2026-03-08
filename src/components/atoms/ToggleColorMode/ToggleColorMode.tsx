import { ClientOnly, IconButton, IconButtonProps, Skeleton } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

interface ColorModeButtonProps {}

export default function ColorModeButton(props: ColorModeButtonProps) {
    const { toggleColorMode, colorMode } = useColorMode()
    return (
        <ClientOnly fallback={<Skeleton boxSize="9" />}>
            <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
                size="sm"
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
