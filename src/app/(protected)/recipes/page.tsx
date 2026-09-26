import SearchRecipeScreen from '@screens/SearchRecipeScreen/SearchRecipesScreen'
import { getRecipeSearchFilters, getRecipes, withRecipeImageUrls } from './actions'

export default async function SearchRecipes({
    searchParams,
}: {
    searchParams: Promise<Record<'keywords' | 'tags' | 'filters', string>>
}) {
    const loadedSearchParams = await searchParams

    const recipeSearchFilters = await getRecipeSearchFilters()

    const recipes = await withRecipeImageUrls(await getRecipes(loadedSearchParams))

    return (
        <SearchRecipeScreen
            tags={recipeSearchFilters.tags}
            filters={recipeSearchFilters.filters}
            recipes={recipes}
        />
    )
}
