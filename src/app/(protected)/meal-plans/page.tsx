import MealPlansScreen from '@screens/MealPlansScreen/MealPlansScreen'
import {
    addMealPlan,
    deleteMealPlan,
    extractTitleFromOnlineSource,
    getMealPlans,
    updateMealPlan,
} from './actions'

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

    return (
        <MealPlansScreen
            getMealPlansForDateRange={getMealPlans}
            initialMeals={initialMeals}
            initialDate={today}
            extractTitleFromOnlineSource={extractTitleFromOnlineSource}
            onAddMealSubmit={addMealPlan}
            onEditMealSubmit={updateMealPlan}
            onDeleteMealSubmit={deleteMealPlan}
        />
    )
}
