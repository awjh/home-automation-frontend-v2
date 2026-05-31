import DescriptionTable, { DescriptionTableProps } from '@atoms/DescriptionTable/DescriptionTable'
import Tag from '@atoms/Tag/Tag'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { Heading, HStack, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import formatDuration from '@utils/formatDuration'
import joinValues from '@utils/joinValues'
import OriginalSource from '../OriginalSource/OriginalSource'
import formatAuthors from '@utils/formatAuthors'

export type RecipeSummaryProps = Pick<
    Recipe,
    'title' | 'authors' | 'originalSource' | 'tags' | 'calories' | 'duration' | 'produces'
>

export default function RecipeSummary({
    title,
    authors,
    originalSource,
    tags,
    calories,
    duration,
    produces,
}: RecipeSummaryProps) {
    const { keyColors } = useColorMode()

    const descriptionTableData: DescriptionTableProps['data'] = [
        { key: 'Calories', value: calories },
    ]

    if (duration.standingTime > 0) {
        descriptionTableData.push(
            {
                key: 'Active duration',
                value: formatDuration(duration.cookingDuration + duration.prepDuration),
            },
            {
                key: 'Standing time',
                value: formatDuration(duration.standingTime),
            },
        )
    } else {
        descriptionTableData.push({
            key: 'Duration',
            value: formatDuration(duration.cookingDuration + duration.prepDuration),
        })
    }

    if ('serves' in produces) {
        descriptionTableData.push({ key: 'Serves', value: produces.serves })
    } else {
        descriptionTableData.push({
            key: 'Produces',
            value: joinValues(produces.quantity, produces.measure),
        })
    }

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
                    {formatAuthors(authors)}
                </Heading>
                <OriginalSource source={originalSource} />
            </VStack>
            <HStack gap={{ base: 2, md: 4 }}>
                {Object.values(tags)
                    .flat()
                    .map((tag) => (
                        <Tag key={tag} value={tag} />
                    ))}
            </HStack>
            <DescriptionTable data={descriptionTableData} />
        </VStack>
    )
}
