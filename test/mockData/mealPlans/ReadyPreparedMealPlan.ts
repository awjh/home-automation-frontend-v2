import { Course, MealTime, ReadyPrepared } from '@awjh/home-automation-v2-api-models/mealPlans'
import { RecipeDuration } from '@awjh/home-automation-v2-api-models/shared'
import MealPlan from '@defs/MealPlan'

const ReadyPreparedMealPlan: MealPlan = {
    author: 'M&S',
    course: Course.MAIN,
    date: '2026-02-27',
    mealTime: MealTime.DINNER,
    source: {
        type: 'ready_prepared',
    } satisfies ReadyPrepared,
    title: 'Chicken Flatties',
    duration: {
        prepDuration: 0,
        cookingDuration: 15,
        standingTime: 0,
    } satisfies RecipeDuration,
}

export default ReadyPreparedMealPlan
