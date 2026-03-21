import CalendarCell, { CalendarCellVariant } from '@atoms/CalendarCell/CalendarCell'
import { Grid, Text, VStack } from '@chakra-ui/react'
import MonthNames from '@constants/MonthNames'
import useColorMode from '@hooks/useColorMode'

function getCalandarCellVariant({
    renderingDay,
    selectedDay,
    highlightPeriod,
}: {
    renderingDay: number
    selectedDay?: number
    highlightPeriod?: {
        startDay: number
        endDay: number
    }
}): Exclude<CalendarCellVariant, 'spacer'> {
    let variant: Exclude<CalendarCellVariant, 'spacer'> = 'default'

    if (renderingDay === selectedDay) {
        variant = 'selected'
    }

    if (highlightPeriod) {
        if (renderingDay >= highlightPeriod.startDay && renderingDay <= highlightPeriod.endDay) {
            variant = variant === 'selected' ? 'selected-highlighted' : 'highlighted'
        }
    }

    return variant
}

export interface CalendarProps {
    month: number // 0-indexed e.g. 0 for January, 1 for February, etc.
    year: number
    highlightPeriod?: {
        startDay: number
        endDay: number
    }
    selectedDay?: number
    onSelect: (selectedDate: Date) => void | Promise<void>
}

export default function Calendar(props: CalendarProps) {
    const { keyColors } = useColorMode()

    const monthName = MonthNames[props.month]
    const firstOfMonth = new Date(props.year, props.month, 1)
    const lastOfMonth = new Date(props.year, props.month + 1, 0)

    const numWeeks = Math.ceil((firstOfMonth.getDay() + lastOfMonth.getDate()) / 7)

    return (
        <VStack borderWidth={2} borderColor={keyColors.primary} p={'2'} w={'full'}>
            <Text
                fontSize={{ base: 'lg', lg: 'xl' }}
                color={keyColors.primary}
                textTransform={'capitalize'}
            >
                {monthName} {props.year}
            </Text>
            <Grid
                templateColumns={'repeat(7, 1fr)'}
                templateRows={`repeat(${numWeeks}, 1fr)`}
                w={{
                    base: 'full',
                }}
            >
                {new Array(firstOfMonth.getDay()).fill(undefined).map((_, idx) => (
                    <CalendarCell
                        key={`before-first-day-${idx}-${props.month}-${props.year}`}
                        variant="spacer"
                    />
                ))}
                {new Array(lastOfMonth.getDate()).fill(undefined).map((_, idx) => {
                    const renderingDate = new Date(props.year, props.month, idx + 1, 12)
                    const variant = getCalandarCellVariant({
                        renderingDay: idx + 1,
                        selectedDay: props.selectedDay,
                        highlightPeriod: props.highlightPeriod,
                    })

                    return (
                        <CalendarCell
                            key={`day-${idx}-${props.month}-${props.year}`}
                            day={renderingDate.getDate()}
                            variant={variant}
                            onClick={() => props.onSelect(renderingDate)}
                        />
                    )
                })}
                {new Array(numWeeks * 7 - lastOfMonth.getDate() - firstOfMonth.getDay())
                    .fill(undefined)
                    .map((_, idx) => (
                        <CalendarCell
                            key={`after-last-day-${idx}-${props.month}-${props.year}`}
                            variant="spacer"
                        />
                    ))}
            </Grid>
        </VStack>
    )
}
