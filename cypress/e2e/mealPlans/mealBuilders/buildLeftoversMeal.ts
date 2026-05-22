import { PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

export default function buildLeftoversMeal(
    date: string,
    mealTime: MealTime,
    title: string,
    fromDate: string,
    course: Course = Course.MAIN,
): PostMealPlanBody {
    return {
        author: 'Rukmini Iyer',
        course,
        date,
        duration: {
            prepDuration: 5,
            cookingDuration: 15,
            standingTime: 0,
        },
        mealTime,
        source: {
            type: SourceType.LEFTOVERS,
            fromDate,
        },
        title,
    }
}
