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
    hideOnMobileOnError?: boolean
    fallbackColor?: 'subtle' | 'lessSubtle'
}

export default function ImageWithFallback({
    w,
    h,
    src,
    alt,
    hideOnMobileOnError: hideOnError = true,
    fallbackColor = 'subtle',
}: ImageWithFallbackProps) {
    const { keyColors } = useColorMode()
    const [failedSrc, setFailedSrc] = useState<string | null>(null)
    const hasError = failedSrc === src || !src

    if (hasError) {
        return (
            <Box
                display={{ base: hideOnError ? 'none' : 'flex', md: 'flex' }}
                alignItems={'center'}
                justifyContent={'center'}
                w={w}
                h={h}
                minW={w}
                maxW={w}
                minH={h}
                maxH={h}
                bg={keyColors[fallbackColor]}
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
            w={w}
            h={h}
            minW={w}
            maxW={w}
            minH={h}
            maxH={h}
            objectFit={'cover'}
            objectPosition={'center'}
            onError={() => setFailedSrc(src)}
        />
    )
}
