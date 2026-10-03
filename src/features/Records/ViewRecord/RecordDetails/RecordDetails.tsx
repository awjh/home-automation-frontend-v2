import { Text } from '@chakra-ui/react'
import MusicRecord from '@defs/MusicRecord'
import useColorMode from '@hooks/useColorMode'

export type RecordDetailsProps = Pick<MusicRecord, 'labels' | 'catNo' | 'year'>

// Shown as a single line in the style of a record's credits, e.g. "Label · CAT 001 · 1977"
export default function RecordDetails({ labels, catNo, year }: RecordDetailsProps) {
    const { keyColors } = useColorMode()

    return (
        <Text
            color={keyColors.primary}
            fontFamily={'lekton'}
            fontSize={{ base: 'sm', lg: 'md' }}
            data-testid={'record-details'}
        >
            {labels.join(', ')} · <Text as={'span'}>{catNo}</Text> · {year}
        </Text>
    )
}
