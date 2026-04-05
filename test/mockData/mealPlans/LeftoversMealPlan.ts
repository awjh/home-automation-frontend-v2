import {
    Course,
    Leftovers,
    MealTime,
    SourceType,
} from '@awjh/home-automation-v2-api-models/mealPlans'
import { RecipeDuration } from '@awjh/home-automation-v2-api-models/shared'
import MealPlan from '@defs/MealPlan'

const LeftoversMealPlan: MealPlan = {
    author: 'Andrew Hurt',
    course: Course.MAIN,
    date: '2026-02-26',
    mealTime: MealTime.DINNER,
    source: {
        type: SourceType.LEFTOVERS,
        fromDate: '2026-02-24',
    } satisfies Leftovers,
    title: 'Chicken Satay',
    duration: {
        prepDuration: 0,
        cookingDuration: 5,
        standingTime: 0,
    } satisfies RecipeDuration,
}

export default LeftoversMealPlan
