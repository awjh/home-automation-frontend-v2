// Matches the Monday-based weeks used by the recipe page weekday buttons
export default function getMondayOfWeek(today = new Date()) {
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
    return monday
}
