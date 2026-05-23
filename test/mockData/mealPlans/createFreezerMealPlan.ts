import { MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import FreezerMealPlan from './FreezerMealPlan'
import createPostMealPlanFixture from './createPostMealPlanFixture'

export default function createFreezerMealPlan(date: string, mealTime: MealTime, title: string) {
    return createPostMealPlanFixture(FreezerMealPlan, {
        date,
        mealTime,
        title,
    })
}