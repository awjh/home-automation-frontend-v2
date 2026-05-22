export default function getStartOfWeek(today = new Date()) {
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    return weekStart
}
