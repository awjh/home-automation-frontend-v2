import Tag from '@atoms/Tag/Tag'
import { MealTime, Course } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Box, HStack } from '@chakra-ui/react'
import { formatDate } from '@utils/formatDate'

export interface RecipeMealPlanDate {
    date: string
    mealTime: MealTime
    course: Course
}

export interface RecipeMealPlansProps {
    dates: RecipeMealPlanDate[]
    onDateClick: (date: string) => void
}

const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
] as const

const dayLabels: Record<(typeof daysOfWeek)[number], { base: string; md: string; lg: string }> = {
    monday: { base: 'm', md: 'mon', lg: 'monday' },
    tuesday: { base: 'tu', md: 'tue', lg: 'tuesday' },
    wednesday: { base: 'w', md: 'wed', lg: 'wednesday' },
    thursday: { base: 'th', md: 'thur', lg: 'thursday' },
    friday: { base: 'f', md: 'fri', lg: 'friday' },
    saturday: { base: 'sa', md: 'sat', lg: 'saturday' },
    sunday: { base: 'su', md: 'sun', lg: 'sunday' },
}

function parseIsoDate(date: string): Date | undefined {
    const [year, month, day] = date.split('-').map(Number)

    if (!year || !month || !day) {
        return undefined
    }

    return new Date(year, month - 1, day)
}

function getStartOfWeek(date: Date): Date {
    const startOfWeek = new Date(date)
    const dayOfWeek = startOfWeek.getDay()
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    startOfWeek.setHours(0, 0, 0, 0)
    startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday)

    return startOfWeek
}

function resolveClickedDateForDay(
    day: (typeof daysOfWeek)[number],
    dates: RecipeMealPlanDate[],
    currentWeekStart: Date,
) {
    const targetDayIndex = daysOfWeek.indexOf(day)

    const matchingDates = dates
        .map((mealPlanDate) => parseIsoDate(mealPlanDate.date))
        .filter((date): date is Date => Boolean(date))
        .map((date) => {
            const weekStart = getStartOfWeek(date)
            const diffInDays = Math.round(
                (weekStart.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24),
            )

            return {
                date,
                weekOffset: diffInDays / 7,
                dayIndex: (date.getDay() + 6) % 7,
            }
        })
        // Keep only dates from this week, next week, and the week after that so the
        // click resolves to the nearest forward occurrence of the selected weekday.
        .filter(
            ({ weekOffset, dayIndex }) =>
                [0, 1, 2].includes(weekOffset) && dayIndex === targetDayIndex,
        )
        .sort((a, b) => a.date.getTime() - b.date.getTime())

    if (matchingDates.length > 0) {
        return formatDate(matchingDates[0].date)
    }

    // If there is no scheduled match, default to the selected weekday in the current week.
    const fallbackDate = new Date(currentWeekStart)
    fallbackDate.setDate(currentWeekStart.getDate() + targetDayIndex)

    return formatDate(fallbackDate)
}

export default function RecipeMealPlans({ dates, onDateClick }: RecipeMealPlansProps) {
    const currentWeekStart = getStartOfWeek(new Date())
    const dayStatuses = new Map<(typeof daysOfWeek)[number], 'highlighted' | 'subtle'>()

    dates.forEach((mealPlanDate) => {
        const parsedDate = parseIsoDate(mealPlanDate.date)

        if (!parsedDate) {
            return
        }

        const weekStart = getStartOfWeek(parsedDate)
        const diffInDays = Math.round(
            (weekStart.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24),
        )
        const weekOffset = diffInDays / 7

        // Only care about this week, next week, and the week after that for highlighting purposes.
        if (![0, 1, 2].includes(weekOffset)) {
            return
        }

        const dayName = daysOfWeek[(parsedDate.getDay() + 6) % 7]
        const nextStatus = weekOffset === 0 ? 'highlighted' : 'subtle'
        const currentStatus = dayStatuses.get(dayName)

        if (currentStatus !== 'highlighted') {
            dayStatuses.set(dayName, nextStatus)
        }
    })

    return (
        <HStack gap={{ base: 2, md: 4 }} w={'full'}>
            {daysOfWeek.map((day) => {
                const label = dayLabels[day]

                return (
                    <Tag
                        key={day}
                        onClick={() =>
                            onDateClick(resolveClickedDateForDay(day, dates, currentWeekStart))
                        }
                        value={
                            <>
                                <Box as="span" display={{ base: 'inline', md: 'none' }}>
                                    {label.base}
                                </Box>
                                <Box as="span" display={{ base: 'none', md: 'inline', lg: 'none' }}>
                                    {label.md}
                                </Box>
                                <Box as="span" display={{ base: 'none', lg: 'inline' }}>
                                    {label.lg}
                                </Box>
                            </>
                        }
                        status={dayStatuses.get(day) ?? 'default'}
                    />
                )
            })}
        </HStack>
    )
}
