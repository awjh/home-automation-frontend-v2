import ImageWithFallback from '@atoms/ImageWithFallback/ImageWithFallback'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { Box, Flex, HStack, Stack, VStack } from '@chakra-ui/react'
import TabbedContent from '@molecules/TabbedContent/TabbedContent'
import RecipeMealPlans from './RecipeMealPlans/RecipeMealPlans'
import RecipeIngredients from './RecipeIngredients/RecipeIngredients'
import RecipeSummary from './RecipeSummary/RecipeSummary'
import useColorMode from '@hooks/useColorMode'
import RecipeMethod from './RecipeMethod/RecipeMethod'

const imageWidths = {
    base: 'full',
    md: '305px',
    lg: '350px',
    xl: '460px',
}

const imageHeights = {
    base: 'full',
    md: '225px',
    lg: '266px',
    xl: '350px',
}

interface ViewRecipeProps {
    recipe: Recipe
    dates: string[]
    onDateClick: (date: string) => void
}

export default function ViewRecipe({ recipe, dates, onDateClick }: ViewRecipeProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack p={{ base: 0, md: 4 }} gap={{ base: 0, md: 6 }} w={'full'} alignItems={'start'}>
            <Stack
                w={'full'}
                p={{ base: 4, md: 0 }}
                gap={6}
                flexDirection={{ base: 'column', md: 'row' }}
            >
                <ImageWithFallback
                    w={imageWidths}
                    h={imageHeights}
                    src={recipe.image}
                    alt={recipe.title}
                />
                <VStack
                    alignItems={'start'}
                    justifyContent={'space-between'}
                    gap={{ base: 6, md: 2, lg: 4 }}
                    h={imageHeights}
                    w={'full'}
                >
                    <RecipeSummary {...recipe} />
                    <RecipeMealPlans dates={dates} onDateClick={onDateClick} />
                </VStack>
            </Stack>
            <Flex mt={{ base: 2, md: 0 }} h={0.5} alignSelf={'stretch'} bg={keyColors.primary} />
            <Box display={{ base: 'block', md: 'none' }} w={'full'}>
                <TabbedContent
                    childrenByTab={{
                        Ingredients: (
                            <Box p={4}>
                                <RecipeIngredients ingredients={recipe.ingredients} />
                            </Box>
                        ),
                        Method: (
                            <Box p={4}>
                                <RecipeMethod method={recipe.method} />
                            </Box>
                        ),
                    }}
                />
            </Box>
            <HStack
                display={{ base: 'none', md: 'flex' }}
                p={{ base: 4, md: 0 }}
                w={'full'}
                gap={6}
                justifyContent={'start'}
                alignItems={'start'}
            >
                <Box pr={{ base: 0, md: 6 }} boxSizing={'border-box'} minW={imageWidths}>
                    <RecipeIngredients ingredients={recipe.ingredients} />
                </Box>
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    w={0.5}
                    alignSelf={'stretch'}
                    bg={keyColors.primary}
                    ml={{ base: 0, md: -6 }}
                />
                <Box flex={1}>
                    <RecipeMethod method={recipe.method} />
                </Box>
            </HStack>
        </VStack>
    )
}
