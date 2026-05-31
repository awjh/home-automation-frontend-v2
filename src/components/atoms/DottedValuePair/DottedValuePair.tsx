import { Box, Flex, Text } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import useColorMode from '@hooks/useColorMode'
import { type CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'

const bounceScroll = keyframes`
    0%, 12% {
        transform: translateX(0);
    }

    50%, 62% {
        transform: translateX(calc(var(--scroll-distance) * -1));
    }

    100% {
        transform: translateX(0);
    }
`

export interface DottedValuePairProps {
    left: ReactNode
    right: ReactNode
}

export default function DottedValuePair({ left, right }: DottedValuePairProps) {
    const { keyColors } = useColorMode()
    const leftContainerRef = useRef<HTMLDivElement>(null)
    const leftTextRef = useRef<HTMLParagraphElement>(null)
    const [overflowDistance, setOverflowDistance] = useState(0)

    useEffect(() => {
        const leftContainer = leftContainerRef.current
        const leftText = leftTextRef.current

        if (!leftContainer || !leftText) {
            return
        }

        const updateOverflowDistance = () => {
            const nextOverflowDistance = Math.max(
                leftText.scrollWidth - leftContainer.clientWidth,
                0,
            )

            setOverflowDistance((currentOverflowDistance) =>
                Math.abs(currentOverflowDistance - nextOverflowDistance) < 1
                    ? currentOverflowDistance
                    : nextOverflowDistance,
            )
        }

        updateOverflowDistance()

        if (typeof ResizeObserver === 'undefined') {
            return
        }

        const resizeObserver = new ResizeObserver(updateOverflowDistance)

        resizeObserver.observe(leftContainer)
        resizeObserver.observe(leftText)

        return () => {
            resizeObserver.disconnect()
        }
    }, [left])

    const shouldAnimate = overflowDistance > 0
    const animationDuration = `${Math.max(10, overflowDistance / 24)}s`

    return (
        <Flex
            justifyContent={'space-between'}
            alignItems={'start'}
            minW={0}
            w="full"
            fontSize={{ base: 'sm', md: 'lg' }}
        >
            <Box ref={leftContainerRef} minW={0} overflow={'hidden'} mr={2} flexShrink={1}>
                <Text
                    ref={leftTextRef}
                    color={keyColors.primary}
                    whiteSpace={'nowrap'}
                    display={'inline-block'}
                    style={{ '--scroll-distance': `${overflowDistance}px` } as CSSProperties}
                    animation={
                        shouldAnimate
                            ? `${bounceScroll} ${animationDuration} ease-in-out infinite`
                            : undefined
                    }
                    willChange={shouldAnimate ? 'transform' : undefined}
                >
                    {left}
                </Text>
            </Box>
            <Box
                flex={1}
                borderBottomWidth={2}
                borderBottomStyle={'dotted'}
                borderBottomColor={keyColors.primary}
                position={'relative'}
                top={'1rem'}
                minW={4}
            ></Box>
            <Text pl={2} color={keyColors.primary} flexShrink={0} whiteSpace="nowrap">
                {right}
            </Text>
        </Flex>
    )
}
