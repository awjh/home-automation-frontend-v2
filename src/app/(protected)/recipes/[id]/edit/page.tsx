import type { Metadata } from 'next'
import AddRecipeScreen from '@screens/AddRecipeScreen/AddRecipeScreen'
import getCachedRecipe from '../getCachedRecipe'
import { calculateCalories, extractRecipeFromOnlineSource } from '../../add/actions'
import { editRecipe, getRecipeSearchFilters } from './actions'

interface EditRecipePageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditRecipePageProps): Promise<Metadata> {
    const { id } = await params
    const recipe = await getCachedRecipe(id)

    return {
        title: `Edit ${recipe.title}`,
    }
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
    const { id } = await params
    const [recipe, recipeSearchFilters] = await Promise.all([
        getCachedRecipe(id),
        getRecipeSearchFilters(),
    ])

    return (
        <AddRecipeScreen
            recipe={recipe}
            tags={recipeSearchFilters.tags}
            editRecipe={editRecipe}
            extractRecipeFromOnlineSource={extractRecipeFromOnlineSource}
            calculateCalories={calculateCalories}
        />
    )
}
