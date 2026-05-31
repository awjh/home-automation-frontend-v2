import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { VStack } from '@chakra-ui/react'
import NavBar from '@features/NavBar/NavBar'
import ViewRecipe from '@features/Recipes/ViewRecipe/ViewRecipe'

export interface RecipeScreenProps {
    recipe: Recipe
    dates: string[]
}

export default function RecipeScreen({ recipe, dates }: RecipeScreenProps) {
    return (
        <VStack width={'full'}>
            <NavBar />
            <ViewRecipe recipe={recipe} dates={dates} onDateClick={() => undefined} />
        </VStack>
    )
}
