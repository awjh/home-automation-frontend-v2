import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import MockBaseRecipe from './shared/MockBaseRecipe'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { OnlineSource } from '@awjh/home-automation-v2-api-models/shared'

const OnlineRecipe: Recipe = {
    id: '4cf6d5fe-fdb1-4c99-bbb4-1ae2a0e83822',
    originalSource: {
        type: SourceType.ONLINE,
        url: 'https://www.seriouseats.com/weeknight-spaghetti-bolognese-recipe',
    } satisfies OnlineSource,
    ...MockBaseRecipe,
}

export default OnlineRecipe
