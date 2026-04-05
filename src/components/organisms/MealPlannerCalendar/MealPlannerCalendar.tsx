import Button from '@atoms/Button/Button'
import { Button as ChakraButton, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import Calendar from '@molecules/Calendar/Calendar'
import { useState } from 'react'
import {
    LuCalendar,
    LuChevronDown,
    LuChevronsDown,
    LuChevronsUp,
    LuChevronUp,
} from 'react-icons/lu'
import { calculateHighlightedPeriod, HighlightedPeriod } from './utils/calculateHighlightedPeriod'

function formatDate(date: Date) {
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    })
}

interface MealPlannerCalendarsProps {
    onDateRangeSelected: (startDate: Date, endDate: Date) => void
}

export default function MealPlannerCalendars(props: MealPlannerCalendarsProps) {
    const today = new Date()

    const { keyColors } = useColorMode()

    const [showNumPreviousMonths, setShowNumPreviousMonths] = useState(1)
    const [showNumNextMonths, setShowNumNextMonths] = useState(1)

    const [showCalendar, setShowCalendar] = useState(false)

    const [highlightedPeriod, setHighlightedPeriod] = useState<HighlightedPeriod>(
        calculateHighlightedPeriod(today),
    )

    const onSelect = (selectedDate: Date) => {
        const newHighlightedPeriod = calculateHighlightedPeriod(selectedDate)
        setHighlightedPeriod(newHighlightedPeriod)
        props.onDateRangeSelected(
            newHighlightedPeriod.fullSpan.startDate,
            newHighlightedPeriod.fullSpan.endDate,
        )
    }

    return (
        <VStack
            w={'full'}
            maxW={'500px'}
            gap={0}
            borderColor={keyColors.primary}
            borderWidth={{ base: 2, md: 0 }}
            borderRadius={0}
            p={0}
        >
            <ChakraButton
                w={'full'}
                type={'button'}
                bg={showCalendar ? keyColors.subtle : keyColors.secondary}
                color={keyColors.primary}
                _hover={{ bg: keyColors.subtle, color: keyColors.primary }}
                borderRadius={0}
                onClick={() => setShowCalendar(!showCalendar)}
                display={{ base: 'flex', md: 'none' }}
                size={'lg'}
                px={4}
            >
                <LuCalendar />
                <Text flex={1}>
                    {formatDate(highlightedPeriod.fullSpan.startDate)} -{' '}
                    {formatDate(highlightedPeriod.fullSpan.endDate)}
                </Text>
                {showCalendar ? <LuChevronUp /> : <LuChevronDown />}
            </ChakraButton>
            <VStack
                w={'full'}
                gap={4}
                display={{ base: showCalendar ? 'flex' : 'none', md: 'flex' }}
                bg={{ base: showCalendar ? keyColors.subtle : 'transparent', md: 'transparent' }}
                borderRadius={0}
                p={{ base: 4, md: 0 }}
            >
                <Button
                    type={'button'}
                    colorStyle={'secondary'}
                    w={'full'}
                    onClick={() => setShowNumPreviousMonths((prev) => prev + 1)}
                    size={'lg'}
                >
                    <LuChevronsUp />
                    Show Previous Month
                </Button>
                {new Array(showNumPreviousMonths)
                    .fill(0)
                    .map((_, i) => {
                        const prevMonth = new Date(
                            today.getFullYear(),
                            today.getMonth() - (i + 1),
                            1,
                        )

                        return (
                            <Calendar
                                key={`prev-${i}`}
                                month={prevMonth.getMonth()}
                                year={prevMonth.getFullYear()}
                                onSelect={onSelect}
                                highlightPeriod={
                                    highlightedPeriod.breakdown[
                                        `${prevMonth.getMonth()}-${prevMonth.getFullYear()}`
                                    ]
                                }
                                backgroundStyle={{ base: 'subtle', md: 'normal' }}
                            />
                        )
                    })
                    .reverse()}
                <Calendar
                    month={today.getMonth()}
                    year={today.getFullYear()}
                    onSelect={onSelect}
                    highlightPeriod={
                        highlightedPeriod.breakdown[`${today.getMonth()}-${today.getFullYear()}`]
                    }
                    selectedDay={today.getDate()}
                    backgroundStyle={{ base: 'subtle', md: 'normal' }}
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
                                highlightedPeriod.breakdown[
                                    `${nextMonth.getMonth()}-${nextMonth.getFullYear()}`
                                ]
                            }
                            backgroundStyle={{ base: 'subtle', md: 'normal' }}
                        />
                    )
                })}
                <Button
                    type={'button'}
                    colorStyle={'secondary'}
                    w={'full'}
                    onClick={() => setShowNumNextMonths((prev) => prev + 1)}
                >
                    <LuChevronsDown />
                    Show Next Month
                </Button>
            </VStack>
        </VStack>
    )
}
