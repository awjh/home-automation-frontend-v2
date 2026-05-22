import { PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

export default function buildMagazineMeal(
    date: string,
    mealTime: MealTime,
    title: string,
    course: Course = Course.MAIN,
): PostMealPlanBody {
    return {
        author: 'Gordon Ramsay',
        course,
        date,
        duration: {
            prepDuration: 60,
            cookingDuration: 45,
            standingTime: 30,
        },
        mealTime,
        source: {
            type: SourceType.MAGAZINE,
            title: 'Gourmet Weekly',
            issue: 'March 2026',
            page: 45,
        },
        title,
    }
}
