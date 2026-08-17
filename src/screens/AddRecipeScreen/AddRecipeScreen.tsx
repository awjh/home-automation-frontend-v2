import {
    PostCalculateCaloriesBody,
    PostCalculateCaloriesResponse,
    PostRecipeBody,
    PostRecipeResponse,
} from '@awjh/home-automation-v2-api-models'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'

export interface AddRecipeScreenProps {
    recipe?: Recipe
    calculateCalories({
        ingredients,
        produces,
    }: {
        ingredients: PostCalculateCaloriesBody['ingredients']
        produces: Recipe['produces']
    }): Promise<PostCalculateCaloriesResponse>
    addRecipe: (recipe: PostRecipeBody) => Promise<PostRecipeResponse>
}

export default function AddRecipeScreen({
    recipe,
    calculateCalories,
    addRecipe,
}: AddRecipeScreenProps) {
    return null
}
