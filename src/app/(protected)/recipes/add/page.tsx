import AddRecipeScreen from '@screens/AddRecipeScreen/AddRecipeScreen'
import { addRecipe, calculateCalories, extractRecipeFromOnlineSource } from './actions'

export default async function AddRecipe() {
    return (
        <AddRecipeScreen
            addRecipe={addRecipe}
            extractRecipeFromOnlineSource={extractRecipeFromOnlineSource}
            calculateCalories={calculateCalories}
        />
    )
}
