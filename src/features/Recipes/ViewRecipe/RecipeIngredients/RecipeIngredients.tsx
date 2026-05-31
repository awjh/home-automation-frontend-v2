import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { Heading, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import IngredientsList from '../IngredientsList/IngredientsList'

export interface RecipeIngredientsProps {
    ingredients: Recipe['ingredients']
}

export default function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
    const { keyColors } = useColorMode()
    const showSectionHeading = ingredients.length > 1

    return (
        <VStack alignItems={'start'} w={'full'} gap={4}>
            {ingredients.map((ingredientSection, index) => (
                <VStack key={`ingredient-section-${index}`} alignItems={'start'} w={'full'} gap={2}>
                    {showSectionHeading && (
                        <Heading
                            as={'h3'}
                            color={keyColors.primary}
                            fontSize={{ base: 'lg', md: 'xl' }}
                            fontWeight={'normal'}
                            textTransform={'capitalize'}
                        >
                            {ingredientSection.section ?? 'Main Recipe'}
                        </Heading>
                    )}
                    <IngredientsList ingredients={ingredientSection.ingredients} />
                </VStack>
            ))}
        </VStack>
    )
}
