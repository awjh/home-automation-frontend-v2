import { MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'

export default function getMealItemSelector(date: string, mealTime: MealTime) {
    return `[data-testid="meal-plan-item"][data-date="${date}"][data-meal-time="${mealTime}"]`
}
