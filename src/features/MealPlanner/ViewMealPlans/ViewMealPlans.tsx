import { Flex, Stack, VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import useColorMode from '@hooks/useColorMode'
import MealPlannerCalendars from './MealPlannerCalendars/MealPlannerCalendars'
import DaysMeals from './DaysMeals/DaysMeals'
import formatMealsForSelectedDateRange from './utils/formatMealsForSelectedDateRange'

interface ViewMealPlansProps {
    initialDate: Date
    meals: MealPlan[]
    selectedDateRange: { startDate: Date; endDate: Date }
    onDateRangeSelected: (startDate: Date, endDate: Date) => void
    onAddMeal: (day: Date) => void
    onDeleteMeal: (mealPlan: MealPlan) => void
    onEditMeal: (mealPlan: MealPlan) => void
}

export default function ViewMealPlans(props: ViewMealPlansProps) {
    const {
        initialDate,
        meals,
        selectedDateRange,
        onDateRangeSelected,
        onAddMeal,
        onDeleteMeal,
        onEditMeal,
    } = props

    const { keyColors } = useColorMode()
    const mealsByDay = formatMealsForSelectedDateRange(meals, selectedDateRange)

    return (
        <Stack
            w={'full'}
            p={{ base: 2, md: 4 }}
            justifyContent={'center'}
            alignItems={'start'}
            gap={{ base: 4, md: 6 }}
            boxSizing={'border-box'}
            direction={{ base: 'column', lg: 'row' }}
        >
            <MealPlannerCalendars
                initialDate={initialDate}
                onDateRangeSelected={onDateRangeSelected}
            />
            <Flex
                display={{ base: 'none', md: 'flex' }}
                w={0.5}
                alignSelf={'stretch'}
                bg={keyColors.primary}
            />
            <VStack flex={1} gap={4}>
                {mealsByDay.map(([day, mealsForDay]) => (
                    <DaysMeals
                        key={day.toISOString()}
                        day={day}
                        meals={mealsForDay}
                        onAddMeal={onAddMeal}
                        onDeleteMeal={onDeleteMeal}
                        onEditMeal={onEditMeal}
                    />
                ))}
            </VStack>
        </Stack>
    )
}
