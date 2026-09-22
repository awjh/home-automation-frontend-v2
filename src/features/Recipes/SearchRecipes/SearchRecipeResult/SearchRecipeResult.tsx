import ImageWithFallback from '@atoms/ImageWithFallback/ImageWithFallback'
import Tag from '@atoms/Tag/Tag'
import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'
import { Box, Heading, HStack, Stack, VStack } from '@chakra-ui/react'
import RecipeDescriptionTable from '@features/Recipes/ViewRecipe/RecipeDescriptionTable/RecipeDescriptionTable'
import useColorMode from '@hooks/useColorMode'
import formatAuthors from '@utils/formatAuthors'
import Link from 'next/link'

const imageWidths = {
    base: 'full',
    md: '208px',
}

const imageHeights = {
    base: '250px',
    md: '160px',
}

export interface SearchRecipeResultProps {
    recipe: GetRecipesResponse[number]
    colorStyle: 'primary' | 'subtle'
}

export default function SearchRecipeResult(props: SearchRecipeResultProps) {
    const { keyColors } = useColorMode()

    return (
        <Stack
            p={4}
            alignItems={'start'}
            gap={{ base: 4, md: 8 }}
            bg={props.colorStyle === 'primary' ? keyColors.secondary : keyColors.subtle}
            w={'full'}
            direction={{ base: 'column', md: 'row' }}
        >
            <Box asChild w={{ base: 'full', md: 'auto' }} flexShrink={0}>
                <Link href={`/recipes/${props.recipe.id}`} passHref>
                    <ImageWithFallback
                        w={imageWidths}
                        h={imageHeights}
                        src={props.recipe.image}
                        alt={props.recipe.title}
                        hideOnMobileOnError={false}
                        fallbackColor={props.colorStyle === 'primary' ? 'subtle' : 'lessSubtle'}
                    />
                </Link>
            </Box>
            <VStack alignItems={'start'} gap={{ base: 4, md: 2, lg: 4 }}>
                <Link href={`/recipes/${props.recipe.id}`} passHref>
                    <Heading
                        as={'h3'}
                        color={keyColors.primary}
                        fontSize={{ base: 'lg', lg: 'xl', xl: '2xl' }}
                        fontWeight={'normal'}
                        _hover={{ textDecoration: 'underline' }}
                    >
                        {props.recipe.title} - {formatAuthors(props.recipe.authors)}
                    </Heading>
                </Link>
                <HStack gap={{ base: 2, md: 4 }}>
                    {Object.values(props.recipe.tags)
                        .flat()
                        .map((tag) => (
                            <Tag
                                key={tag}
                                value={tag}
                                status={props.colorStyle === 'primary' ? 'default' : 'subtle'}
                            />
                        ))}
                </HStack>
                <RecipeDescriptionTable recipe={props.recipe} />
            </VStack>
        </Stack>
    )
}
