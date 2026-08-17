import { MealTime, Course } from '@awjh/home-automation-v2-api-models/mealPlans'
import LeftoversMealPlan from './LeftoversMealPlan'
import createPostMealPlanFixture from './createPostMealPlanFixture'

export default function createLeftoversMealPlan(
    date: string,
    mealTime: MealTime,
    title: string,
    fromDate: string,
    fromMealTime: MealTime,
    fromCourse: Course,
) {
    return createPostMealPlanFixture(LeftoversMealPlan, {
        date,
        mealTime,
        source: {
            fromDate,
            fromMealTime,
            fromCourse,
        },
        title,
    })
}
