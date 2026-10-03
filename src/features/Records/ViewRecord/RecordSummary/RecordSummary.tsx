import Tag from '@atoms/Tag/Tag'
import { Heading, HStack, VStack } from '@chakra-ui/react'
import { MusicRecord } from '@awjh/home-automation-v2-api-models/records'
import useColorMode from '@hooks/useColorMode'
import formatAuthors from '@utils/formatAuthors'
import RecordDetails from '../RecordDetails/RecordDetails'

export type RecordSummaryProps = Pick<
    MusicRecord,
    'title' | 'artists' | 'tags' | 'labels' | 'catNo' | 'year'
>

export default function RecordSummary({
    title,
    artists,
    tags,
    labels,
    catNo,
    year,
}: RecordSummaryProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack alignItems={'start'} gap={{ base: 4, md: 2, lg: 4 }}>
            <VStack alignItems={'start'} gap={{ base: 0, xl: 2 }}>
                <Heading
                    as={'h1'}
                    color={keyColors.primary}
                    fontSize={{ base: 'xl', lg: '2xl', xl: '3xl' }}
                    fontWeight={'normal'}
                >
                    {title}
                </Heading>
                <Heading
                    as={'h2'}
                    color={keyColors.primary}
                    fontSize={{ base: 'lg', lg: 'xl', xl: '2xl' }}
                    fontWeight={'normal'}
                >
                    {formatAuthors(artists)}
                </Heading>
                <RecordDetails labels={labels} catNo={catNo} year={year} />
            </VStack>
            <HStack gap={{ base: 2, md: 4 }} flexWrap={'wrap'}>
                {Object.values(tags)
                    .flat()
                    .map((tag) => (
                        <Tag key={tag} value={tag} />
                    ))}
            </HStack>
        </VStack>
    )
}
