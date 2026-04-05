import { CalendarProps } from '@molecules/Calendar/Calendar'

export type HighlightedPeriod = {
    fullSpan: {
        startDate: Date
        endDate: Date
    }
    breakdown: {
        [s: string]: CalendarProps['highlightPeriod']
    }
}

export function calculateHighlightedPeriod(selectedDate: Date): HighlightedPeriod {
    const selectedMonthLength = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
    ).getDate()

    const fullSpan = {
        startDate: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate() - selectedDate.getDay(),
        ),
        endDate: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate() + (6 - selectedDate.getDay()),
        ),
    }

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
            fullSpan,
            breakdown: {
                [`${selectedDate.getMonth()}-${selectedDate.getFullYear()}`]: {
                    startDay: 1,
                    endDay: endOfSelectedWeek,
                },
                [`${previousMonth.getMonth()}-${previousMonth.getFullYear()}`]: {
                    startDay: previousMonthLength + startOfSelectedWeek,
                    endDay: previousMonthLength,
                },
            },
        }
    }

    if (endOfSelectedWeek > selectedMonthLength) {
        const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)

        return {
            fullSpan,
            breakdown: {
                [`${selectedDate.getMonth()}-${selectedDate.getFullYear()}`]: {
                    startDay: startOfSelectedWeek,
                    endDay: selectedMonthLength,
                },
                [`${nextMonth.getMonth()}-${nextMonth.getFullYear()}`]: {
                    startDay: 1,
                    endDay: endOfSelectedWeek - selectedMonthLength,
                },
            },
        }
    }
    return {
        fullSpan,
        breakdown: {
            [`${selectedDate.getMonth()}-${selectedDate.getFullYear()}`]: {
                startDay: startOfSelectedWeek,
                endDay: endOfSelectedWeek,
            },
        },
    }
}
