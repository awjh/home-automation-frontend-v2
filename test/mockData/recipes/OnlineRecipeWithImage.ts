import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import MockBaseRecipe from './shared/MockBaseRecipe'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { OnlineSource } from '@awjh/home-automation-v2-api-models/shared'

const OnlineRecipeWithImage: Recipe = {
    id: '7a2fa8b8-8634-489f-8b7d-c64c6b8b8c3f',
    originalSource: {
        type: SourceType.ONLINE,
        url: 'https://www.seriouseats.com/weeknight-spaghetti-bolognese-recipe',
    } satisfies OnlineSource,
    ...MockBaseRecipe,
    image: 'https://images.example.com/recipes/spaghetti-bolognese.jpg',
}

export default OnlineRecipeWithImage
