import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import MockBaseRecipe from './shared/MockBaseRecipe'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { MagazineSource } from '@awjh/home-automation-v2-api-models/shared'

const MagazineRecipe: Recipe = {
    id: '53ca3bc2-5af8-43ac-ab26-398af22d6d88',
    originalSource: {
        type: SourceType.MAGAZINE,
        title: 'Good Food Monthly',
        issue: 'October 2025',
        page: 34,
    } satisfies MagazineSource,
    ...MockBaseRecipe,
}

export default MagazineRecipe
