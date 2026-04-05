import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { BookSource } from '@awjh/home-automation-v2-api-models/shared'
import MealPlan from '@defs/MealPlan'

const BookMealPlanWithOptional: MealPlan = {
    author: 'Dan Toombs',
    course: Course.MAIN,
    date: '2026-02-22',
    mealTime: MealTime.DINNER,
    source: {
        type: SourceType.BOOK,
        title: 'The Curry Bible',
        page: 124,
        series: 'The Curry Guy',
    } satisfies BookSource,
    title: 'Chicken Jalfrezi',
    duration: {
        prepDuration: 15,
        cookingDuration: 60,
        standingTime: 120,
    },
}

export default BookMealPlanWithOptional
