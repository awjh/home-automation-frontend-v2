'use client'

import { Box, ConditionalValue, CssProperties, Image, Tokens } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { useState } from 'react'
import { LuImageOff } from 'react-icons/lu'

export interface ImageWithFallbackProps {
    w: ConditionalValue<Tokens['sizes'] | CssProperties['width']>
    h: ConditionalValue<Tokens['sizes'] | CssProperties['height']>
    src: string | undefined
    alt: string
}

export default function ImageWithFallback({ w, h, src, alt }: ImageWithFallbackProps) {
    const { keyColors } = useColorMode()
    const [failedSrc, setFailedSrc] = useState<string | null>(null)
    const hasError = failedSrc === src || !src

    if (hasError) {
        return (
            <Box
                display={{ base: 'none', md: 'flex' }}
                alignItems={'center'}
                justifyContent={'center'}
                minW={w}
                minH={h}
                maxW={w}
                maxH={h}
                bg={keyColors.subtle}
                color={keyColors.primary}
            >
                <LuImageOff />
            </Box>
        )
    }

    return (
        <Image
            src={src}
            alt={alt}
            minW={w}
            maxW={w}
            minH={h}
            maxH={h}
            objectFit={'cover'}
            onError={() => setFailedSrc(src)}
        />
    )
}
