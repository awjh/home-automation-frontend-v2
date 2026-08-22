import AddRecipeScreen from '@screens/AddRecipeScreen/AddRecipeScreen'
import {
    addRecipe,
    calculateCalories,
    extractRecipeFromOnlineSource,
    uploadRecipeImage,
} from './actions'

export default async function AddRecipe() {
    return (
        <AddRecipeScreen
            addRecipe={addRecipe}
            extractRecipeFromOnlineSource={extractRecipeFromOnlineSource}
            calculateCalories={calculateCalories}
            uploadRecipeImage={uploadRecipeImage}
        />
    )
}
