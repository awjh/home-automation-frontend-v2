import SearchRecipeScreen from '@screens/SearchRecipeScreen/SearchRecipesScreen'
import {
    getNextRecipesPage,
    getRecipeSearchFilters,
    getRecipes,
    RecipeSearchQuery,
    withRecipeImageUrls,
} from './actions'

export default async function SearchRecipes({
    searchParams,
}: {
    searchParams: Promise<Record<'keywords' | 'tags' | 'filters', string>>
}) {
    const { keywords, tags, filters } = await searchParams
    // Only the search itself is taken from the URL so a load always starts from the first page
    const searchQuery: RecipeSearchQuery = Object.fromEntries(
        Object.entries({ keywords, tags, filters }).filter(([, value]) => value !== undefined),
    )

    const recipeSearchFilters = await getRecipeSearchFilters()

    const recipes = await withRecipeImageUrls(await getRecipes(searchQuery))

    return (
        <SearchRecipeScreen
            tags={recipeSearchFilters.tags}
            filters={recipeSearchFilters.filters}
            recipes={recipes}
            loadNextRecipesPage={getNextRecipesPage.bind(null, searchQuery)}
        />
    )
}
