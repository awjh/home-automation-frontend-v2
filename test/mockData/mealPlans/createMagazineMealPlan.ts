import { MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import MagazineMealPlan from './MagazineMealPlan'
import createPostMealPlanFixture from './createPostMealPlanFixture'

export default function createMagazineMealPlan(date: string, mealTime: MealTime, title: string) {
    return createPostMealPlanFixture(MagazineMealPlan, {
        date,
        mealTime,
        title,
    })
}
