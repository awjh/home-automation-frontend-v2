import { Ingredient } from '@awjh/home-automation-v2-api-models/recipes'
import { Box } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import IngredientsList from '../IngredientsList/IngredientsList'

export interface MethodIngredientsProps {
    ingredients: Ingredient[]
}

export default function MethodIngredients({ ingredients }: MethodIngredientsProps) {
    const { keyColors } = useColorMode()

    if (ingredients.length === 0) {
        return null
    }

    return (
        <Box w={'full'} borderWidth={1} borderColor={keyColors.primary} p={4} bg={keyColors.subtle}>
            <IngredientsList ingredients={ingredients} />
        </Box>
    )
}
