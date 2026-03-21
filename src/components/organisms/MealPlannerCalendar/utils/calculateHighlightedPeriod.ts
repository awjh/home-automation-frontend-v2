import { CalendarProps } from '@molecules/Calendar/Calendar'

type HighlightedPeriod = {
    [s: string]: CalendarProps['highlightPeriod']
}

export function calculateHighlightedPeriod(selectedDate: Date): HighlightedPeriod {
    const selectedMonthLength = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
    ).getDate()

    const startOfSelectedWeek = selectedDate.getDate() - selectedDate.getDay()
    const endOfSelectedWeek = startOfSelectedWeek + 6

    if (startOfSelectedWeek < 1) {
        const previousMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
        const previousMonthLength = new Date(
            previousMonth.getFullYear(),
            previousMonth.getMonth() + 1,
            0,
        ).getDate()

        return {
            [`${selectedDate.getMonth()}-${selectedDate.getFullYear()}`]: {
                startDay: 1,
                endDay: endOfSelectedWeek,
            },
            [`${previousMonth.getMonth()}-${previousMonth.getFullYear()}`]: {
                startDay: previousMonthLength + startOfSelectedWeek,
                endDay: previousMonthLength,
            },
        }
    }

    if (endOfSelectedWeek > selectedMonthLength) {
        const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)

        return {
            [`${selectedDate.getMonth()}-${selectedDate.getFullYear()}`]: {
                startDay: startOfSelectedWeek,
                endDay: selectedMonthLength,
            },
            [`${nextMonth.getMonth()}-${nextMonth.getFullYear()}`]: {
                startDay: 1,
                endDay: endOfSelectedWeek - selectedMonthLength,
            },
        }
    }
    return {
        [`${selectedDate.getMonth()}-${selectedDate.getFullYear()}`]: {
            startDay: startOfSelectedWeek,
            endDay: endOfSelectedWeek,
        },
    }
}
