import AddRecipeScreen from '@screens/AddRecipeScreen/AddRecipeScreen'
import { getRecipe } from '../actions'
import { calculateCalories, extractRecipeFromOnlineSource } from '../../add/actions'
import { editRecipe, getRecipeSearchFilters } from './actions'

interface EditRecipePageProps {
    params: Promise<{ id: string }>
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
    const { id } = await params
    const [recipe, recipeSearchFilters] = await Promise.all([
        getRecipe(id),
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
