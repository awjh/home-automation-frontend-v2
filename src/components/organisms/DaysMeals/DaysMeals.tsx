import Button from '@atoms/Button/Button'
import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import useColorMode from '@hooks/useColorMode'
import MealPlanItem from '@molecules/MealPlanItem/MealPlanItem'
import { useMemo } from 'react'

interface DaysMealsProps {
    day: Date
    meals: MealPlan[]
}

const mealTimeOrder: Record<MealTime, number> = {
    [MealTime.BREAKFAST]: 0,
    [MealTime.LUNCH]: 1,
    [MealTime.DINNER]: 2,
}

const courseOrder: Record<Course, number> = {
    [Course.STARTER]: 0,
    [Course.MAIN]: 1,
    [Course.SIDE]: 2,
    [Course.DESSERT]: 3,
}

const pluralRules = new Intl.PluralRules('en-GB', { type: 'ordinal' })
const ordinalSuffixes = new Map([
    ['one', 'st'],
    ['two', 'nd'],
    ['few', 'rd'],
    ['other', 'th'],
])

function formatDayWithOrdinal(date: Date): {
    weekday: string
    day: number
    suffix: string
    month: string
} {
    const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' })
    const month = date.toLocaleDateString('en-GB', { month: 'long' })
    const day = date.getDate()
    const suffix = ordinalSuffixes.get(pluralRules.select(day)) ?? 'th'
    return { weekday, day, suffix, month }
}

export default function DaysMeals(props: DaysMealsProps) {
    const { keyColors } = useColorMode()

    const { weekday, day, suffix, month } = formatDayWithOrdinal(props.day)

    const groupedMeals: [MealTime, MealPlan[]][] = useMemo(() => {
        const groupedMeals: Record<MealTime, MealPlan[]> = props.meals.reduce(
            (groups, meal) => {
                if (!groups[meal.mealTime]) {
                    groups[meal.mealTime] = []
                }
                groups[meal.mealTime].push(meal)
                return groups
            },
            {} as Record<MealTime, MealPlan[]>,
        )
        return (Object.entries(groupedMeals) as [MealTime, MealPlan[]][])
            .sort(([a], [b]) => mealTimeOrder[a as MealTime] - mealTimeOrder[b as MealTime])
            .map(([mealTime, meals]) => [
                mealTime,
                meals.sort((a, b) => {
                    const courseA = courseOrder[a.course]
                    const courseB = courseOrder[b.course]
                    if (courseA !== courseB) {
                        return courseA - courseB
                    }
                    return a.title.localeCompare(b.title)
                }),
            ])
    }, [props.meals])

    return (
        <VStack
            w={'full'}
            color={keyColors.primary}
            borderWidth={2}
            borderColor={keyColors.primary}
            borderRadius={0}
            p={0}
            pb={{ base: 2, md: 4 }}
            gap={0}
            alignItems={'start'}
        >
            <Heading
                fontWeight={'normal'}
                size={{ base: 'xl', md: '2xl' }}
                borderBottomWidth={2}
                borderBottomColor={keyColors.primary}
                w={'full'}
                p={{ base: 3, md: 4 }}
            >
                {weekday} {day}
                <sup>{suffix}</sup> {month}
            </Heading>
            {groupedMeals.map(([mealTime, meals]) => (
                <VStack
                    alignItems={'start'}
                    gap={2}
                    p={{ base: 2, md: 4 }}
                    w={'full'}
                    key={`${mealTime}-${props.day.getTime()}`}
                >
                    <HStack w={'full'}>
                        <Flex bg={keyColors.primary} height={0.5} w={16} />
                        <Text
                            fontSize={{ base: 'lg', md: 'xl' }}
                            color={keyColors.primary}
                            textTransform={'capitalize'}
                        >
                            {mealTime}
                        </Text>
                        <Flex bg={keyColors.primary} height={0.5} flex={1} />
                    </HStack>
                    <VStack alignItems={'start'} gap={6} w={'full'}>
                        {meals.map((meal, idx) => (
                            <MealPlanItem
                                key={`${mealTime}-${props.day.getTime()}-meal-${idx}`}
                                mealPlan={meal}
                                lastItem={idx === meals.length - 1}
                                onDelete={() => {}}
                                onEdit={() => {}}
                            />
                        ))}
                    </VStack>
                </VStack>
            ))}
            {props.meals.length === 0 && (
                <Text
                    px={{ base: 2, md: 4 }}
                    pt={{ base: 2, md: 4 }}
                    pb={0}
                    as="em"
                    fontStyle="italic"
                    fontSize={{ base: 'md', md: 'lg' }}
                >
                    No meals planned.&nbsp;
                    <Button type="button" colorStyle="link" onClick={() => {}}>
                        Add a meal
                    </Button>
                </Text>
            )}
        </VStack>
    )
}
