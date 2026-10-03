import DottedValuePair from '@atoms/DottedValuePair/DottedValuePair'
import { Song } from '@awjh/home-automation-v2-api-models/records'
import { Flex } from '@chakra-ui/react'
import formatTrackDuration from '@utils/formatTrackDuration'

export interface TrackListProps {
    songs: Song[]
    small?: boolean
}

export default function TrackList({ songs, small }: TrackListProps) {
    return (
        <Flex w={'full'} flexDirection={'column'} gap={2}>
            {songs.map((song, idx) => (
                <DottedValuePair
                    small={small}
                    key={`track-${idx}`}
                    left={`${idx + 1}. ${song.title}`}
                    right={formatTrackDuration(song.duration)}
                />
            ))}
        </Flex>
    )
}
