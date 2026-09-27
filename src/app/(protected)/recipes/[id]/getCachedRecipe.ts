import { cache } from 'react'
import { getRecipe } from './actions'

// Shares the recipe fetch between generateMetadata and the page within a single request
const getCachedRecipe = cache(getRecipe)

export default getCachedRecipe
