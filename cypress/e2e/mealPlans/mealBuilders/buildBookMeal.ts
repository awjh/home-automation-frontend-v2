import { PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

export default function buildBookMeal(
    date: string,
    mealTime: MealTime,
    title: string,
    course: Course = Course.MAIN,
): PostMealPlanBody {
    return {
        author: 'Rukmini Iyer',
        course,
        date,
        duration: {
            prepDuration: 10,
            cookingDuration: 30,
            standingTime: 0,
        },
        mealTime,
        source: {
            type: SourceType.BOOK,
            title: 'The Roasting Tin',
            page: 86,
            series: 'Simple Suppers',
        },
        title,
    }
}
