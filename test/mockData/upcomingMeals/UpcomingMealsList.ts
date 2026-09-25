import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import UpcomingMeal from '@features/Home/UpcomingMeals/defs/UpcomingMeal'
import BookMealPlanWithOptional from '../mealPlans/BookMealPlanWithOptional'
import createMealPlanFixture from '../mealPlans/createMealPlanFixture'
import FreezerMealPlan from '../mealPlans/FreezerMealPlan'
import InternalMealPlan from '../mealPlans/InternalMealPlan'
import MagazineMealPlan from '../mealPlans/MagazineMealPlan'
import OnlineMealPlan from '../mealPlans/OnlineMealPlan'

// Deliberately out of order so stories can verify meals are sorted by date, meal time and course
const UpcomingMealsList: UpcomingMeal[] = [
    createMealPlanFixture(MagazineMealPlan, { date: '2026-04-07', mealTime: MealTime.DINNER }),
    {
        ...createMealPlanFixture(InternalMealPlan, {
            date: '2026-04-05',
            mealTime: MealTime.DINNER,
        }),
        image: '/recipe.jpg',
    },
    createMealPlanFixture(OnlineMealPlan, { date: '2026-04-06', mealTime: MealTime.DINNER }),
    createMealPlanFixture(BookMealPlanWithOptional, {
        date: '2026-04-05',
        mealTime: MealTime.LUNCH,
    }),
    createMealPlanFixture(FreezerMealPlan, {
        date: '2026-04-08',
        mealTime: MealTime.DINNER,
        course: Course.DESSERT,
        title: 'Frozen Beef Chilli',
    }),
    createMealPlanFixture(InternalMealPlan, {
        date: '2026-04-08',
        mealTime: MealTime.DINNER,
        course: Course.MAIN,
        title: 'Lemon Chicken Tray Bake',
    }),
]

export const UpcomingMealsListSortedTitles = [
    BookMealPlanWithOptional.title,
    InternalMealPlan.title,
    OnlineMealPlan.title,
    MagazineMealPlan.title,
    'Lemon Chicken Tray Bake',
    'Frozen Beef Chilli',
]

export default UpcomingMealsList
