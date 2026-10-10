import ImageWithFallback from '@atoms/ImageWithFallback/ImageWithFallback'
import { Flex, Stack, Text, VStack } from '@chakra-ui/react'
import EditableImage from '@molecules/EditableImage/EditableImage'
import { MusicRecord } from '@awjh/home-automation-v2-api-models/records'
import useColorMode from '@hooks/useColorMode'
import RecordSummary from './RecordSummary/RecordSummary'
import RecordTracks from './RecordTracks/RecordTracks'

// Record artwork is square
const imageSizes = {
    base: 'full',
    md: '225px',
    lg: '266px',
    xl: '350px',
}

const trackListWidths = {
    base: 'full',
    md: '305px',
    lg: '350px',
    xl: '460px',
}

interface ViewRecordProps {
    record: MusicRecord
    onImageClick?: () => void
}

export default function ViewRecord({ record, onImageClick }: ViewRecordProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack p={{ base: 0, md: 4 }} gap={{ base: 0, md: 6 }} w={'full'} alignItems={'start'}>
            <Stack
                w={'full'}
                p={{ base: 4, md: 0 }}
                gap={6}
                flexDirection={{ base: 'column', md: 'row' }}
            >
                {onImageClick ? (
                    <EditableImage
                        w={imageSizes}
                        h={imageSizes}
                        src={record.image}
                        alt={record.title}
                        subject={'record'}
                        onClick={onImageClick}
                    />
                ) : (
                    <ImageWithFallback
                        w={imageSizes}
                        h={imageSizes}
                        src={record.image}
                        alt={record.title}
                    />
                )}
                <RecordSummary {...record} editHref={`/records/${record.id}/edit`} />
            </Stack>
            <Flex mt={{ base: 2, md: 0 }} h={0.5} alignSelf={'stretch'} bg={keyColors.primary} />
            <VStack
                p={{ base: 4, md: 0 }}
                w={trackListWidths}
                justifyContent={'start'}
                alignItems={'start'}
                gap={4}
            >
                <Text fontSize={'2xl'} color={keyColors.primary}>
                    Tracklist
                </Text>
                <RecordTracks sides={record.sides} />
            </VStack>
        </VStack>
    )
}
