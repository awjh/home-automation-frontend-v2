import Tag from '@atoms/Tag/Tag'
import { HStack } from '@chakra-ui/react'

export interface RecipeMealPlansProps {
    dates: string[]
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

export default function RecipeMealPlans({ dates }: RecipeMealPlansProps) {
    const currentWeekStart = getStartOfWeek(new Date())
    const dayStatuses = new Map<(typeof daysOfWeek)[number], 'highlighted' | 'subtle'>()

    dates.forEach((date) => {
        const parsedDate = parseIsoDate(date)

        if (!parsedDate) {
            return
        }

        const weekStart = getStartOfWeek(parsedDate)
        const diffInDays = Math.round(
            (weekStart.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24),
        )
        const weekOffset = diffInDays / 7

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
        <HStack gap={{ base: 2, md: 4 }}>
            {daysOfWeek.map((day) => (
                <Tag key={day} value={day} status={dayStatuses.get(day) ?? 'default'} />
            ))}
        </HStack>
    )
}
