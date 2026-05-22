import { PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

export default function buildFreezerMeal(
    date: string,
    mealTime: MealTime,
    title: string,
    course: Course = Course.MAIN,
): PostMealPlanBody {
    return {
        author: 'Freezer',
        course,
        date,
        duration: {
            prepDuration: 0,
            cookingDuration: 10,
            standingTime: 0,
        },
        mealTime,
        source: {
            type: SourceType.FREEZER,
        },
        title,
    }
}
