import {
    Course,
    InternalRecipe,
    MealTime,
    SourceType,
} from '@awjh/home-automation-v2-api-models/mealPlans'
import { RecipeDuration } from '@awjh/home-automation-v2-api-models/shared'
import MealPlan from '@defs/MealPlan'

const InternalMealPlan: MealPlan = {
    author: 'Andrew Hurt',
    course: Course.MAIN,
    date: '2026-02-28',
    mealTime: MealTime.DINNER,
    source: {
        type: SourceType.INTERNAL_RECIPE,
        recipeId: '52cb0799-441c-4133-91fc-a4e76dc7fec4',
    } satisfies InternalRecipe,
    title: 'Chicken Satay',
    duration: {
        prepDuration: 20,
        cookingDuration: 40,
        standingTime: 10,
    } satisfies RecipeDuration,
}

export default InternalMealPlan
