import { PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

export default function buildInternalRecipeMeal(
    date: string,
    mealTime: MealTime,
    title: string,
    recipeId: string,
    course: Course = Course.MAIN,
): PostMealPlanBody {
    return {
        author: 'Andrew Hurt',
        course,
        date,
        duration: {
            prepDuration: 20,
            cookingDuration: 25,
            standingTime: 0,
        },
        mealTime,
        source: {
            type: SourceType.INTERNAL_RECIPE,
            recipeId,
        },
        title,
    }
}
