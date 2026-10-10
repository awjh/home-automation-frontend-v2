import ImageWithFallback from '@atoms/ImageWithFallback/ImageWithFallback'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { Box, chakra, Flex, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { LuImagePlus } from 'react-icons/lu'
import TabbedContent from '@molecules/TabbedContent/TabbedContent'
import RecipeMealPlans, { RecipeMealPlanDate } from './RecipeMealPlans/RecipeMealPlans'
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
    dates: RecipeMealPlanDate[]
    onDateClick: (date: string) => void
    onImageClick?: () => void
}

export default function ViewRecipe({ recipe, dates, onDateClick, onImageClick }: ViewRecipeProps) {
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
                    <chakra.button
                        type={'button'}
                        aria-label={recipe.image ? 'Change recipe image' : 'Add recipe image'}
                        onClick={onImageClick}
                        position={'relative'}
                        w={imageWidths}
                        cursor={'pointer'}
                        flexShrink={0}
                        className={'group'}
                        data-testid={'recipe-image-button'}
                    >
                        <ImageWithFallback
                            w={imageWidths}
                            h={imageHeights}
                            src={recipe.image}
                            alt={recipe.title}
                        />
                        <Flex
                            position={'absolute'}
                            inset={0}
                            alignItems={'center'}
                            justifyContent={'center'}
                            gap={2}
                            bg={keyColors.secondary}
                            color={keyColors.primary}
                            opacity={0}
                            transition={'opacity 0.2s'}
                            _groupHover={{ opacity: 0.75 }}
                            _groupFocusVisible={{ opacity: 0.75 }}
                        >
                            <LuImagePlus />
                            <Text>{recipe.image ? 'Change image' : 'Add image'}</Text>
                        </Flex>
                    </chakra.button>
                ) : (
                    <ImageWithFallback
                        w={imageWidths}
                        h={imageHeights}
                        src={recipe.image}
                        alt={recipe.title}
                    />
                )}
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
                <VStack
                    pr={{ base: 0, md: 6 }}
                    py={0}
                    boxSizing={'border-box'}
                    minW={imageWidths}
                    justifyContent={'start'}
                    alignItems={'start'}
                    gap={4}
                >
                    <Text fontSize={'2xl'} color={keyColors.primary}>
                        Ingredients
                    </Text>
                    <RecipeIngredients ingredients={recipe.ingredients} />
                </VStack>
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    w={0.5}
                    alignSelf={'stretch'}
                    bg={keyColors.primary}
                    ml={{ base: 0, md: -6 }}
                />
                <VStack flex={1} gap={4}>
                    <Text fontSize={'2xl'} color={keyColors.primary} alignSelf={'start'}>
                        Method
                    </Text>
                    <RecipeMethod method={recipe.method} />
                </VStack>
            </HStack>
        </VStack>
    )
}
