'use client'

import Collapsible from '@atoms/Collapsible/Collapsible'
import {
    GetBellboardsResponse,
    PostBellboardRingResponse,
} from '@awjh/home-automation-v2-api-models'
import { SimpleGrid, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import BellboardRoom from './BellboardRoom/BellboardRoom'

export interface BellboardsProps {
    bellboards: GetBellboardsResponse
    ringBellboard: (bellboardName: string, room: string) => Promise<PostBellboardRingResponse>
}

export default function Bellboards({ bellboards, ringBellboard }: BellboardsProps) {
    const { keyColors } = useColorMode()

    if (bellboards.length === 0) {
        return <Text color={keyColors.primary}>No bellboards found</Text>
    }

    return (
        <VStack w={'full'} gap={4} px={{ base: 2, sm: 3, md: 4 }}>
            {bellboards.map((bellboard) => (
                <Collapsible key={bellboard.bellboardName} title={bellboard.bellboardName}>
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} gap={4} p={4}>
                        {bellboard.rooms.map((room) => (
                            <BellboardRoom
                                key={room}
                                room={room}
                                onRing={() => ringBellboard(bellboard.bellboardName, room)}
                            />
                        ))}
                    </SimpleGrid>
                </Collapsible>
            ))}
        </VStack>
    )
}
