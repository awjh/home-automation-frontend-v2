import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { BookSource } from '@awjh/home-automation-v2-api-models/shared'
import MealPlan from '@defs/MealPlan'

const BookMealPlanMissingOptional: MealPlan = {
    author: 'Mary Berry',
    course: Course.MAIN,
    date: '2026-02-21',
    mealTime: MealTime.DINNER,
    source: {
        type: SourceType.BOOK,
        title: 'Mary Berry Everyday',
        page: 123,
    } satisfies BookSource,
    title: 'Spaghetti Bolognese',
    duration: {
        prepDuration: 15,
        cookingDuration: 30,
        standingTime: 0,
    },
}

export default BookMealPlanMissingOptional
