import ImageWithFallback from '@atoms/ImageWithFallback/ImageWithFallback'
import Tag from '@atoms/Tag/Tag'
import { GetRecordsResponse } from '@awjh/home-automation-v2-api-models'
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import RecordDetails from '@features/Records/ViewRecord/RecordDetails/RecordDetails'
import useColorMode from '@hooks/useColorMode'
import formatAuthors from '@utils/formatAuthors'
import Link from 'next/link'

// Record artwork is square
const imageSizes = {
    base: '96px',
    md: '160px',
}

export interface SearchRecordResultProps {
    record: GetRecordsResponse[number]
    colorStyle: 'primary' | 'subtle'
}

export default function SearchRecordResult({ record, colorStyle }: SearchRecordResultProps) {
    const { keyColors } = useColorMode()

    return (
        <HStack
            p={4}
            alignItems={'start'}
            gap={{ base: 4, md: 8 }}
            bg={colorStyle === 'primary' ? keyColors.secondary : keyColors.subtle}
            w={'full'}
        >
            <Box asChild flexShrink={0}>
                <Link href={`/records/${record.id}`} passHref>
                    <ImageWithFallback
                        w={imageSizes}
                        h={imageSizes}
                        src={record.image}
                        alt={record.title}
                        hideOnMobileOnError={false}
                        fallbackColor={colorStyle === 'primary' ? 'subtle' : 'lessSubtle'}
                    />
                </Link>
            </Box>
            <VStack alignItems={'start'} gap={{ base: 2, lg: 4 }} minW={0}>
                <Link href={`/records/${record.id}`} passHref>
                    <Heading
                        as={'h3'}
                        color={keyColors.primary}
                        fontSize={{ base: 'lg', lg: 'xl', xl: '2xl' }}
                        fontWeight={'normal'}
                        _hover={{ textDecoration: 'underline' }}
                    >
                        {record.title} - {formatAuthors(record.artists)}
                    </Heading>
                </Link>
                <RecordDetails labels={record.labels} catNo={record.catNo} year={record.year} />
                <Text color={keyColors.primary} fontSize={'sm'} textTransform={'capitalize'}>
                    {record.format} · {record.type}
                </Text>
                <HStack gap={{ base: 2, md: 4 }} flexWrap={'wrap'}>
                    {Object.values(record.tags)
                        .flat()
                        .map((tag) => (
                            <Tag
                                key={tag}
                                value={tag}
                                status={colorStyle === 'primary' ? 'default' : 'subtle'}
                            />
                        ))}
                </HStack>
            </VStack>
        </HStack>
    )
}
