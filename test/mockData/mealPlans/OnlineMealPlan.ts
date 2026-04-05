import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { OnlineSource } from '@awjh/home-automation-v2-api-models/shared'
import MealPlan from '@defs/MealPlan'

const OnlineMealPlan: MealPlan = {
    author: 'Amanda Grant',
    course: Course.MAIN,
    date: '2026-02-23',
    mealTime: MealTime.DINNER,
    source: {
        type: SourceType.ONLINE,
        url: 'https://www.bbcgoodfood.com/recipes/gnocchi-roasted-red-pepper-sauce',
    } satisfies OnlineSource,
    title: 'Gnocchi with Roasted Red Pepper Sauce',
    duration: {
        prepDuration: 10,
        cookingDuration: 20,
        standingTime: 0,
    },
}

export default OnlineMealPlan
