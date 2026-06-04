import RecipeScreen from '@screens/RecipeScreen/RecipeScreen'
import {
    addMealPlanFromRecipePage,
    deleteMealPlanFromRecipePage,
    getRecipe,
    getRecipeImageDataUrl,
} from './actions'

interface ViewRecipeProps {
    params: Promise<{ id: string }>
}

export default async function ViewRecipe({ params }: ViewRecipeProps) {
    const { id } = await params
    const recipe = await getRecipe(id)
    const resolvedImage = await getRecipeImageDataUrl(recipe.image)
    const recipeWithImage = {
        ...recipe,
        image: resolvedImage,
    }

    return (
        <RecipeScreen
            recipe={recipeWithImage}
            dates={[]}
            onAddMealSubmit={addMealPlanFromRecipePage}
            onDeleteMealSubmit={deleteMealPlanFromRecipePage}
        />
    )
}
