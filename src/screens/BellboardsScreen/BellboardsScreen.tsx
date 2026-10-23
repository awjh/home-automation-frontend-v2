'use client'

import { VStack } from '@chakra-ui/react'
import Bellboards, { BellboardsProps } from '@features/Bellboards/Bellboards'
import NavBar from '@features/NavBar/NavBar'

export type BellboardsScreenProps = BellboardsProps

export default function BellboardsScreen(props: BellboardsScreenProps) {
    return (
        <VStack w="full">
            <NavBar />
            <Bellboards {...props} />
        </VStack>
    )
}
