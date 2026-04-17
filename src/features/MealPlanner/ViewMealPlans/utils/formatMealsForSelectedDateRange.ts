import MealPlan from '@defs/MealPlan'
import { formatDate } from '@utils/formatDate'

export default function formatMealsForSelectedDateRange(
    meals: MealPlan[],
    selectedDateRange: { startDate: Date; endDate: Date },
): [Date, MealPlan[]][] {
    const blankMealsByDay: Record<string, MealPlan[]> = {}
    const currentDate = new Date(selectedDateRange.startDate)
    while (currentDate <= selectedDateRange.endDate) {
        blankMealsByDay[formatDate(currentDate)] = []
        currentDate.setDate(currentDate.getDate() + 1)
    }

    const mealsByDay = meals.reduce((groups, meal) => {
        if (!groups[meal.date]) {
            groups[meal.date] = []
        }

        groups[meal.date].push(meal)
        return groups
    }, blankMealsByDay)

    return (Object.entries(mealsByDay) as [string, MealPlan[]][])
        .map(([date, mealsForDate]) => {
            const [year, month, day] = date.split('-').map(Number)
            return [new Date(year, month - 1, day), mealsForDate] as [Date, MealPlan[]]
        })
        .sort((a, b) => a[0].getTime() - b[0].getTime())
}
