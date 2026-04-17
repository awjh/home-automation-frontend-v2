import ViewMealPlans from '@features/ViewMealPlans/ViewMealPlans'
import { getMealPlans } from './actions'

export default async function MealPlans() {
    const today = new Date()
    const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay(),
    )
    const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - today.getDay()),
    )

    const initialMeals = await getMealPlans(startDate, endDate)

    return <ViewMealPlans getMealPlansForDateRange={getMealPlans} initialMeals={initialMeals} />
}
