import EditLinkButton from '@atoms/EditLinkButton/EditLinkButton'
import Tag from '@atoms/Tag/Tag'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { Heading, HStack, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import formatAuthors from '@utils/formatAuthors'
import OriginalSource from '../OriginalSource/OriginalSource'
import RecipeDescriptionTable from '../RecipeDescriptionTable/RecipeDescriptionTable'

export type RecipeSummaryProps = Pick<
    Recipe,
    'title' | 'authors' | 'originalSource' | 'tags' | 'calories' | 'duration' | 'produces'
> & {
    editHref?: string
}

export default function RecipeSummary({
    title,
    authors,
    originalSource,
    tags,
    calories,
    duration,
    produces,
    editHref,
}: RecipeSummaryProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack alignItems={'start'} gap={{ base: 4, md: 2, lg: 4 }} w={'full'}>
            <HStack w={'full'} justifyContent={'space-between'} alignItems={'start'} gap={4}>
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
                {editHref && <EditLinkButton href={editHref} label={'Edit recipe'} />}
            </HStack>
            <HStack gap={{ base: 2, md: 4 }}>
                {Object.values(tags)
                    .flat()
                    .map((tag) => (
                        <Tag key={tag} value={tag} />
                    ))}
            </HStack>
            <RecipeDescriptionTable recipe={{ calories, duration, produces }} />
        </VStack>
    )
}
