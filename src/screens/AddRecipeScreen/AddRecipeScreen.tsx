'use client'

import {
    PostCalculateCaloriesBody,
    PostCalculateCaloriesResponse,
    PostRecipeBody,
    PostRecipeResponse,
    PutRecipeBody,
    PutRecipeResponse,
    GetExtractedExternalRecipeResponse,
} from '@awjh/home-automation-v2-api-models'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { VStack } from '@chakra-ui/react'
import { UploadRecipeImageInput, UploadRecipeImageResponse } from '@defs/Image'
import NavBar from '@features/NavBar/NavBar'
import AddRecipe from '@features/Recipes/AddRecipe/AddRecipe'

type AddRecipeScreenSharedProps = {
    calculateCalories({
        ingredients,
        produces,
    }: {
        ingredients: PostCalculateCaloriesBody['ingredients']
        produces: Recipe['produces']
    }): Promise<PostCalculateCaloriesResponse>
    extractRecipeFromOnlineSource: (url: string) => Promise<GetExtractedExternalRecipeResponse>
}

type AddRecipeScreenCreateProps = AddRecipeScreenSharedProps & {
    recipe?: never
    addRecipe: (recipe: PostRecipeBody) => Promise<PostRecipeResponse>
    editRecipe?: never
    uploadRecipeImage: (input: UploadRecipeImageInput) => Promise<UploadRecipeImageResponse>
}

type AddRecipeScreenEditProps = Omit<AddRecipeScreenSharedProps, 'recipe'> & {
    recipe: Recipe
    editRecipe: (recipeId: string, recipe: PutRecipeBody) => Promise<PutRecipeResponse>
    addRecipe?: never
    uploadRecipeImage?: never
}

export type AddRecipeScreenProps = AddRecipeScreenCreateProps | AddRecipeScreenEditProps

export default function AddRecipeScreen(props: AddRecipeScreenProps) {
    return (
        <VStack width={'full'}>
            <NavBar />
            {props.editRecipe ? (
                <AddRecipe
                    recipe={props.recipe}
                    calculateCalories={props.calculateCalories}
                    extractRecipeFromOnlineSource={props.extractRecipeFromOnlineSource}
                    editRecipe={props.editRecipe}
                />
            ) : (
                <AddRecipe
                    recipe={props.recipe}
                    calculateCalories={props.calculateCalories}
                    extractRecipeFromOnlineSource={props.extractRecipeFromOnlineSource}
                    addRecipe={props.addRecipe}
                    uploadRecipeImage={props.uploadRecipeImage}
                />
            )}
        </VStack>
    )
}
