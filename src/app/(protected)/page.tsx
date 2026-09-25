import HomeScreen from '@screens/HomeScreen/HomeScreen'
import { getUpcomingMeals } from './actions'

// Show this week (from the most recent Sunday, or today if it is Sunday) and next week
const UPCOMING_DAYS = 14

export default async function Home() {
    const today = new Date()
    const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay(),
    )
    const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + UPCOMING_DAYS - 1,
    )

    const upcomingMeals = await getUpcomingMeals({ startDate, endDate })

    return <HomeScreen upcomingMeals={upcomingMeals} />
}
