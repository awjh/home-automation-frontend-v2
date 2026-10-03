import { Heading, VStack } from '@chakra-ui/react'
import { MusicRecord } from '@awjh/home-automation-v2-api-models/records'
import useColorMode from '@hooks/useColorMode'
import TrackList from '../TrackList/TrackList'

export interface RecordTracksProps {
    sides: MusicRecord['sides']
}

export default function RecordTracks({ sides }: RecordTracksProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack alignItems={'start'} w={'full'} gap={4}>
            {sides.map((side, index) => (
                <VStack key={`record-side-${index}`} alignItems={'start'} w={'full'} gap={2}>
                    <Heading
                        as={'h3'}
                        color={keyColors.primary}
                        fontSize={{ base: 'md', md: 'lg' }}
                        fontWeight={'normal'}
                    >
                        Side {side.name}
                    </Heading>
                    <TrackList songs={side.songs} />
                </VStack>
            ))}
        </VStack>
    )
}
