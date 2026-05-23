import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import BookMealPlanWithOptional from './BookMealPlanWithOptional'
import createPostMealPlanFixture from './createPostMealPlanFixture'

export default function createBookMealPlan(
    date: string,
    mealTime: MealTime,
    title: string,
    course: Course = Course.MAIN,
) {
    return createPostMealPlanFixture(BookMealPlanWithOptional, {
        course,
        date,
        mealTime,
        title,
    })
}