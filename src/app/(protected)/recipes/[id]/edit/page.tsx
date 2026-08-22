import AddRecipeScreen from '@screens/AddRecipeScreen/AddRecipeScreen'
import { getRecipe } from '../actions'
import { calculateCalories, extractRecipeFromOnlineSource } from '../../add/actions'
import { editRecipe } from './actions'

interface EditRecipePageProps {
    params: Promise<{ id: string }>
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
    const { id } = await params
    const recipe = await getRecipe(id)

    return (
        <AddRecipeScreen
            recipe={recipe}
            editRecipe={editRecipe}
            extractRecipeFromOnlineSource={extractRecipeFromOnlineSource}
            calculateCalories={calculateCalories}
        />
    )
}
