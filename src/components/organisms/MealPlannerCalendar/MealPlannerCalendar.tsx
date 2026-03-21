import Button from '@atoms/Button/Button'
import { VStack } from '@chakra-ui/react'
import Calendar, { CalendarProps } from '@molecules/Calendar/Calendar'
import { useState } from 'react'
import { LuChevronDown, LuChevronUp } from 'react-icons/lu'
import { calculateHighlightedPeriod } from './utils/calculateHighlightedPeriod'

export default function MealPlannerCalendars() {
    const today = new Date()

    const [showNumPreviousMonths, setShowNumPreviousMonths] = useState(1)
    const [showNumNextMonths, setShowNumNextMonths] = useState(1)

    const [highlightedPeriod, setHighlightedPeriod] = useState<{
        [s: string]: CalendarProps['highlightPeriod']
    }>(calculateHighlightedPeriod(today))

    const onSelect = (selectedDate: Date) => {
        setHighlightedPeriod(calculateHighlightedPeriod(selectedDate))
    }

    return (
        <VStack w={'full'} maxW={'500px'} gap={4}>
            <Button
                type={'button'}
                colorStyle={'secondary'}
                w={'full'}
                onClick={() => setShowNumPreviousMonths((prev) => prev + 1)}
                size={'lg'}
            >
                <LuChevronUp />
                Show Previous Month
            </Button>
            {new Array(showNumPreviousMonths)
                .fill(0)
                .map((_, i) => {
                    const prevMonth = new Date(today.getFullYear(), today.getMonth() - (i + 1), 1)

                    return (
                        <Calendar
                            key={`prev-${i}`}
                            month={prevMonth.getMonth()}
                            year={prevMonth.getFullYear()}
                            onSelect={onSelect}
                            highlightPeriod={
                                highlightedPeriod[
                                    `${prevMonth.getMonth()}-${prevMonth.getFullYear()}`
                                ]
                            }
                        />
                    )
                })
                .reverse()}
            <Calendar
                month={today.getMonth()}
                year={today.getFullYear()}
                onSelect={onSelect}
                highlightPeriod={highlightedPeriod[`${today.getMonth()}-${today.getFullYear()}`]}
                selectedDay={today.getDate()}
            />
            {new Array(showNumNextMonths).fill(0).map((_, i) => {
                const nextMonth = new Date(today.getFullYear(), today.getMonth() + (i + 1), 1)

                return (
                    <Calendar
                        key={`next-${i}`}
                        month={nextMonth.getMonth()}
                        year={nextMonth.getFullYear()}
                        onSelect={onSelect}
                        highlightPeriod={
                            highlightedPeriod[`${nextMonth.getMonth()}-${nextMonth.getFullYear()}`]
                        }
                    />
                )
            })}
            <Button
                type={'button'}
                colorStyle={'secondary'}
                w={'full'}
                onClick={() => setShowNumNextMonths((prev) => prev + 1)}
            >
                <LuChevronDown />
                Show Next Month
            </Button>
        </VStack>
    )
}
