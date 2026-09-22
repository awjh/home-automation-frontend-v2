import AddRecipeScreen from '@screens/AddRecipeScreen/AddRecipeScreen'
import {
    addRecipe,
    calculateCalories,
    extractRecipeFromOnlineSource,
    getRecipeSearchFilters,
    uploadRecipeImage,
} from './actions'

export default async function AddRecipe() {
    const recipeSearchFilters = await getRecipeSearchFilters()

    return (
        <AddRecipeScreen
            tags={recipeSearchFilters.tags}
            addRecipe={addRecipe}
            extractRecipeFromOnlineSource={extractRecipeFromOnlineSource}
            calculateCalories={calculateCalories}
            uploadRecipeImage={uploadRecipeImage}
        />
    )
}
