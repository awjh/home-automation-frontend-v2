import {
    Course,
    Freezer,
    MealTime,
    SourceType,
} from '@awjh/home-automation-v2-api-models/mealPlans'
import { RecipeDuration } from '@awjh/home-automation-v2-api-models/shared'
import MealPlan from '@defs/MealPlan'

const FreezerMealPlan: MealPlan = {
    author: 'Andrew Hurt',
    course: Course.MAIN,
    date: '2026-02-25',
    mealTime: MealTime.DINNER,
    source: {
        type: SourceType.FREEZER,
    } satisfies Freezer,
    title: 'Chicken Satay',
    duration: {
        prepDuration: 0,
        cookingDuration: 5,
        standingTime: 0,
    } satisfies RecipeDuration,
}

export default FreezerMealPlan
