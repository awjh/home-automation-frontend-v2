import addDays from './addDays'
import formatIsoDate from './formatIsoDate'
import getStartOfWeek from './getStartOfWeek'

export default function getWeekDates(baseDate = new Date()) {
    const weekStart = getStartOfWeek(baseDate)

    return new Array(7).fill(null).map((_, index) => formatIsoDate(addDays(weekStart, index)))
}
