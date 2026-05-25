import DescriptionTable, { DescriptionTableProps } from '@atoms/DescriptionTable/DescriptionTable'
import Tag from '@atoms/Tag/Tag'
import {
    Recipe,
    OriginalSource as RecipeOriginalSource,
    RecipeTags,
} from '@awjh/home-automation-v2-api-models/recipes'
import { RecipeDuration } from '@awjh/home-automation-v2-api-models/shared'
import { Heading, HStack, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import formatDuration from '@utils/formatDuration'
import joinValues from '@utils/joinValues'
import OriginalSource from '../OriginalSource/OriginalSource'

export interface RecipeSummaryProps {
    title: string
    authors: string[]
    source: RecipeOriginalSource
    tags: RecipeTags
    calories: number
    duration: RecipeDuration
    produces: Recipe['produces']
}

export default function RecipeSummary({
    title,
    authors,
    source,
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
        <VStack alignItems={'start'} gap={4}>
            <VStack alignItems={'start'} gap={1}>
                <Heading
                    as={'h1'}
                    size={'2xl'}
                    color={keyColors.primary}
                    fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
                    fontWeight={'normal'}
                >
                    {title}
                </Heading>
                <Heading
                    as={'h2'}
                    size={'md'}
                    color={keyColors.primary}
                    fontSize={{ base: 'md', sm: 'lg', md: 'xl' }}
                    fontWeight={'normal'}
                >
                    {authors.join(', ')}
                </Heading>
                <OriginalSource source={source} />
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
