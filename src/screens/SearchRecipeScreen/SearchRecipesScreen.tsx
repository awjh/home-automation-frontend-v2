'use client'

import { RecipeTags } from '@awjh/home-automation-v2-api-models/recipes'
import type {
    SearchDefs,
    GetRecipesQueryParameters,
    GetRecipesResponse,
} from '@awjh/home-automation-v2-api-models'
import { VStack } from '@chakra-ui/react'
import NavBar from '@features/NavBar/NavBar'
import SearchRecipes from '@features/Recipes/SearchRecipes/SearchRecipes'

export interface SearchRecipesFiltersProps {
    tags: RecipeTags
    filters: SearchDefs.RecipeFilters
    recipes: GetRecipesResponse
    loadNextRecipesPage: (
        previousRecipeId: NonNullable<GetRecipesQueryParameters['previousRecipeId']>,
    ) => Promise<GetRecipesResponse>
}

export default function SearchRecipeScreen({
    tags,
    filters,
    recipes,
    loadNextRecipesPage,
}: SearchRecipesFiltersProps) {
    return (
        <VStack w="full">
            <NavBar />
            <SearchRecipes
                tags={tags}
                filters={filters}
                recipes={recipes}
                loadNextRecipesPage={loadNextRecipesPage}
            />
        </VStack>
    )
}
