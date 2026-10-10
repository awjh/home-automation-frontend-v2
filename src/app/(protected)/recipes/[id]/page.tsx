import type { Metadata } from 'next'
import RecipeScreen from '@screens/RecipeScreen/RecipeScreen'
import {
    addMealPlanFromRecipePage,
    deleteMealPlanFromRecipePage,
    getRecipeImageUrl,
    getRecipeMealPlanDates,
    updateRecipeImage,
} from './actions'
import { uploadRecipeImage } from '../add/actions'
import getCachedRecipe from './getCachedRecipe'

interface ViewRecipeProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ViewRecipeProps): Promise<Metadata> {
    const { id } = await params
    const recipe = await getCachedRecipe(id)

    return {
        title: [recipe.title, recipe.authors.join(', ')].filter(Boolean).join(' - '),
    }
}

export default async function ViewRecipe({ params }: ViewRecipeProps) {
    const { id } = await params
    const [recipe, mealPlanDates] = await Promise.all([
        getCachedRecipe(id),
        getRecipeMealPlanDates(id),
    ])
    const resolvedImage = await getRecipeImageUrl(recipe.image)
    const recipeWithImage = {
        ...recipe,
        image: resolvedImage,
    }

    return (
        <RecipeScreen
            recipe={recipeWithImage}
            dates={mealPlanDates}
            onAddMealSubmit={addMealPlanFromRecipePage}
            onDeleteMealSubmit={deleteMealPlanFromRecipePage}
            uploadRecipeImage={uploadRecipeImage}
            updateRecipeImage={updateRecipeImage}
        />
    )
}
