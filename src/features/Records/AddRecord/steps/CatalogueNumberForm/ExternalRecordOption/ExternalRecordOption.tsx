import Button from '@atoms/Button/Button'
import ImageWithFallback from '@atoms/ImageWithFallback/ImageWithFallback'
import Tag from '@atoms/Tag/Tag'
import { GetExternalRecordsResponse } from '@awjh/home-automation-v2-api-models'
import { Flex, HStack, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

export interface ExternalRecordOptionProps {
    release: GetExternalRecordsResponse[number]
    isSelected: boolean
    isLoading: boolean
    disabled: boolean
    onSelect: () => void
}

// One MusicBrainz pressing in the catalogue number search results
export default function ExternalRecordOption({
    release,
    isSelected,
    isLoading,
    disabled,
    onSelect,
}: ExternalRecordOptionProps) {
    const { keyColors } = useColorMode()

    // e.g. 'Warner Bros. Records · K 56344 · 1977 · GB'
    const credits = [
        release.labels.join(', '),
        release.catNo,
        release.releaseDate ?? release.year,
        release.country,
    ]
        .filter(Boolean)
        .join(' · ')

    const pressing = [
        release.format,
        release.type,
        `${release.trackCount} track${release.trackCount === 1 ? '' : 's'}`,
        release.disambiguation,
    ]
        .filter(Boolean)
        .join(' · ')

    return (
        <Flex
            borderWidth={2}
            borderColor={isSelected ? keyColors.primary : keyColors.buttonHoverBg}
            bg={isSelected ? keyColors.subtle : 'transparent'}
            p={3}
            alignItems={'center'}
            gap={3}
            data-testid={`external-record-${release.musicBrainzId}`}
        >
            <ImageWithFallback
                w={'64px'}
                h={'64px'}
                src={release.thumbnailUrl}
                alt={release.title}
                hideOnMobileOnError={false}
            />
            <VStack alignItems={'start'} gap={1} flex={1} minW={0}>
                <Text color={keyColors.primary} fontWeight={'bold'}>
                    {release.title} - {release.artists.join(', ')}
                </Text>
                <Text color={keyColors.primary} fontFamily={'lekton'} fontSize={'sm'}>
                    {credits}
                </Text>
                <Text color={keyColors.primary} fontSize={'sm'}>
                    {pressing}
                </Text>
                {release.colours.length > 0 && (
                    <HStack gap={2} flexWrap={'wrap'}>
                        {release.colours.map((colour) => (
                            <Tag key={colour} value={colour} status={'subtle'} />
                        ))}
                    </HStack>
                )}
            </VStack>
            <Button
                type={'button'}
                colorStyle={isSelected ? 'secondary' : 'primary'}
                size={'sm'}
                loading={isLoading}
                disabled={disabled}
                onClick={onSelect}
            >
                {isSelected ? 'Selected' : 'Select'}
            </Button>
        </Flex>
    )
}
