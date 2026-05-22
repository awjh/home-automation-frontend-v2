import { PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

export default function buildReadyPreparedMeal(
    date: string,
    mealTime: MealTime,
    title: string,
    course: Course = Course.MAIN,
): PostMealPlanBody {
    return {
        author: 'M&S',
        course,
        date,
        duration: {
            prepDuration: 0,
            cookingDuration: 15,
            standingTime: 0,
        },
        mealTime,
        source: {
            type: SourceType.READY_PREPARED,
        },
        title,
    }
}
