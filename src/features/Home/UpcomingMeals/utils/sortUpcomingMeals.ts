import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import UpcomingMeal from '../defs/UpcomingMeal'

const mealTimeOrder: MealTime[] = [MealTime.BREAKFAST, MealTime.LUNCH, MealTime.DINNER]
const courseOrder: Course[] = [Course.STARTER, Course.MAIN, Course.SIDE, Course.DESSERT]

export default function sortUpcomingMeals(meals: UpcomingMeal[]): UpcomingMeal[] {
    return [...meals].sort(
        (a, b) =>
            a.date.localeCompare(b.date) ||
            mealTimeOrder.indexOf(a.mealTime) - mealTimeOrder.indexOf(b.mealTime) ||
            courseOrder.indexOf(a.course) - courseOrder.indexOf(b.course),
    )
}
