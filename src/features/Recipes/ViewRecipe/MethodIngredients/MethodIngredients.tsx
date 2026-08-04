import { Ingredient } from '@awjh/home-automation-v2-api-models/recipes'
import { Box, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import IngredientsList from '../IngredientsList/IngredientsList'

export interface MethodIngredientsProps {
    ingredients: Ingredient[]
    showWhenEmpty?: boolean
    maxW?: string
    small?: boolean
}

export default function MethodIngredients({
    ingredients,
    showWhenEmpty = false,
    maxW = '600px',
    small = false,
}: MethodIngredientsProps) {
    const { keyColors } = useColorMode()

    if (ingredients.length === 0 && !showWhenEmpty) {
        return null
    }

    return (
        <Box
            w={'full'}
            maxW={maxW}
            borderWidth={1}
            borderColor={keyColors.primary}
            p={{ base: 2, md: 4 }}
            bg={keyColors.subtle}
        >
            {ingredients.length > 0 ? (
                <IngredientsList ingredients={ingredients} small={small} />
            ) : (
                <Text color={keyColors.primary} fontStyle={'italic'}>
                    No ingredients for step
                </Text>
            )}
        </Box>
    )
}
