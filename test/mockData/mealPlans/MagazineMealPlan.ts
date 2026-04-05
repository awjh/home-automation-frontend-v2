import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { MagazineSource } from '@awjh/home-automation-v2-api-models/shared'
import MealPlan from '@defs/MealPlan'

const MagazineMealPlan: MealPlan = {
    author: 'Gordon Ramsay',
    course: Course.MAIN,
    date: '2026-02-24',
    mealTime: MealTime.DINNER,
    source: {
        type: SourceType.MAGAZINE,
        title: 'Gourmet Weekly',
        issue: 'March 2026',
        page: 45,
    } satisfies MagazineSource,
    title: 'Beef Wellington',
    duration: {
        prepDuration: 60,
        cookingDuration: 45,
        standingTime: 30,
    },
}

export default MagazineMealPlan
