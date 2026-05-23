import { MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import ReadyPreparedMealPlan from './ReadyPreparedMealPlan'
import createPostMealPlanFixture from './createPostMealPlanFixture'

export default function createReadyPreparedMealPlan(
    date: string,
    mealTime: MealTime,
    title: string,
) {
    return createPostMealPlanFixture(ReadyPreparedMealPlan, {
        date,
        mealTime,
        title,
    })
}
