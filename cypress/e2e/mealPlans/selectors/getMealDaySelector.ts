export default function getMealDaySelector(date: string) {
    return `[data-testid="meal-day"][data-date="${date}"]`
}
