import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import MockBaseRecipe from './shared/MockBaseRecipe'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { BookSource } from '@awjh/home-automation-v2-api-models/shared'

const BookRecipe: Recipe = {
    id: '5d3d4f5b-4ad8-4937-a9df-49d59f5f42d4',
    originalSource: {
        type: SourceType.BOOK,
        title: 'The Italian Family Kitchen',
        page: 128,
        series: 'Weeknight Classics',
    } satisfies BookSource,
    ...MockBaseRecipe,
}

export default BookRecipe
