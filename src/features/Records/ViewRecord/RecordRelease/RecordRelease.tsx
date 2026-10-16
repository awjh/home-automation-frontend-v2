import { Text } from '@chakra-ui/react'
import { MusicRecord } from '@awjh/home-automation-v2-api-models/records'
import RELEASE_TYPE_LABELS from '@constants/ReleaseTypeLabels'
import useColorMode from '@hooks/useColorMode'

export type RecordReleaseProps = Pick<MusicRecord, 'format' | 'type'>

// Shown in the same style as RecordDetails, e.g. '12" · Album'
export default function RecordRelease({ format, type }: RecordReleaseProps) {
    const { keyColors } = useColorMode()

    return (
        <Text
            color={keyColors.primary}
            fontFamily={'lekton'}
            fontSize={{ base: 'sm', lg: 'md' }}
            data-testid={'record-release'}
        >
            {format} · {RELEASE_TYPE_LABELS[type]}
        </Text>
    )
}
