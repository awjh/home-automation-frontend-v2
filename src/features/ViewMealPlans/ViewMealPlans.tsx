// Feature: View Meal Plans
// This component was migrated from the old MealPlans template.

'use client'

import { GetExtractedExternalRecipeResponse } from '@awjh/home-automation-v2-api-models'
import { Flex, Spinner, Stack, VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import AddMealPlan from '@features/AddMealPlan/AddMealPlan'
import AddMealPlanFormValues from '@features/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import { SearchInternalRecipes } from '@features/AddMealPlan/AddMealPlanForm/steps/AddMealPlanInternalRecipeStep/AddMealPlanInternalRecipeStep'
import useColorMode from '@hooks/useColorMode'
import AreYouSure from '@molecules/AreYouSure/AreYouSure'
import DaysMeals from '@organisms/DaysMeals/DaysMeals'
import MealPlannerCalendars from '@organisms/MealPlannerCalendar/MealPlannerCalendar'
import NavBar from '@organisms/NavBar/NavBar'
import { formatDate } from '@utils/formatDate'
import { useCallback, useEffect, useRef, useState } from 'react'

interface MealPlansViewProps {
    getMealPlansForDateRange: (startDate: Date, endDate: Date) => Promise<MealPlan[]>
    initialMeals?: MealPlan[]
    extractTitleFromOnlineSource?: (url: string) => Promise<GetExtractedExternalRecipeResponse>
    searchInternalRecipes?: SearchInternalRecipes
    onAddMealSubmit?: (values: AddMealPlanFormValues) => Promise<void>
    onDeleteMealSubmit?: (mealPlan: MealPlan) => Promise<void> | void
}

const defaultExtractTitleFromOnlineSource =
    async (): Promise<GetExtractedExternalRecipeResponse> => ({
        title: '',
        duration: {
            prepDuration: 0,
            cookingDuration: 0,
            standingTime: 0,
        },
    })

const defaultSearchInternalRecipes: SearchInternalRecipes = async () => []

const defaultOnAddMealSubmit = async (_: AddMealPlanFormValues) => {
    void _
}

const defaultOnDeleteMealSubmit = async (_: MealPlan) => {
    void _
}

function formatMealsForSelectedDateRange(
    meals: MealPlan[],
    selectedDateRange: { startDate: Date; endDate: Date },
): [Date, MealPlan[]][] {
    const blankMealsByDay: Record<string, MealPlan[]> = {}
    const currentDate = new Date(selectedDateRange.startDate)
    while (currentDate <= selectedDateRange.endDate) {
        blankMealsByDay[formatDate(currentDate)] = []
        currentDate.setDate(currentDate.getDate() + 1)
    }

    const mealsByDay = meals.reduce((groups, meal) => {
        if (!groups[meal.date]) {
            groups[meal.date] = []
        }

        groups[meal.date].push(meal)
        return groups
    }, blankMealsByDay)

    return (Object.entries(mealsByDay) as [string, MealPlan[]][])
        .map(([date, meals]) => {
            const [year, month, day] = date.split('-').map(Number)
            return [new Date(year, month - 1, day), meals] as [Date, MealPlan[]]
        })
        .sort((a, b) => a[0].getTime() - b[0].getTime())
}

export default function MealPlansView({
    getMealPlansForDateRange,
    initialMeals = [],
    extractTitleFromOnlineSource = defaultExtractTitleFromOnlineSource,
    searchInternalRecipes = defaultSearchInternalRecipes,
    onAddMealSubmit = defaultOnAddMealSubmit,
    onDeleteMealSubmit = defaultOnDeleteMealSubmit,
}: MealPlansViewProps) {
    const { keyColors } = useColorMode()
    const [addMealDate, setAddMealDate] = useState<Date | null>(null)
    const [mealPlanPendingDelete, setMealPlanPendingDelete] = useState<MealPlan | null>(null)

    const [meals, setMeals] = useState<[Date, MealPlan[]][]>(() => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        const endDate = new Date(startOfWeek)
        endDate.setDate(startOfWeek.getDate() + 6)
        return formatMealsForSelectedDateRange(initialMeals, { startDate: startOfWeek, endDate })
    })
    const [isLoading, setIsLoading] = useState(false)

    const latestRequestId = useRef(0)
    const getMealPlansForDateRangeRef = useRef(getMealPlansForDateRange)

    useEffect(() => {
        getMealPlansForDateRangeRef.current = getMealPlansForDateRange
    }, [getMealPlansForDateRange])

    const onDateRangeSelected = useCallback(async (startDate: Date, endDate: Date) => {
        const requestId = ++latestRequestId.current
        setIsLoading(true)
        const result = await getMealPlansForDateRangeRef.current(startDate, endDate)
        setIsLoading(false)

        if (requestId === latestRequestId.current) {
            setMeals(formatMealsForSelectedDateRange(result, { startDate, endDate }))
        }
    }, [])

    const onAddMeal = useCallback((day: Date) => {
        setAddMealDate(day)
    }, [])

    const onCloseAddMeal = useCallback(() => {
        setAddMealDate(null)
    }, [])

    const handleAddMealSubmit = useCallback(
        async (values: AddMealPlanFormValues) => {
            await onAddMealSubmit(values)
            setAddMealDate(null)
        },
        [onAddMealSubmit],
    )

    const onDeleteMeal = useCallback((mealPlan: MealPlan) => {
        setMealPlanPendingDelete(mealPlan)
    }, [])

    const onEditMeal = useCallback((mealPlan: MealPlan) => {
        void mealPlan
    }, [])

    const onCancelDeleteMeal = useCallback(() => {
        setMealPlanPendingDelete(null)
    }, [])

    const onConfirmDeleteMeal = useCallback(async () => {
        if (!mealPlanPendingDelete) {
            return
        }

        await onDeleteMealSubmit(mealPlanPendingDelete)

        setMeals((currentMeals) =>
            currentMeals.map(([day, dayMeals]) => [
                day,
                dayMeals.filter((meal) => meal !== mealPlanPendingDelete),
            ]),
        )
        setMealPlanPendingDelete(null)
    }, [mealPlanPendingDelete, onDeleteMealSubmit])

    return (
        <VStack width={'full'} minHeight={'100vh'}>
            {addMealDate && (
                <AddMealPlan
                    date={formatDate(addMealDate)}
                    extractTitleFromOnlineSource={extractTitleFromOnlineSource}
                    searchInternalRecipes={searchInternalRecipes}
                    onSubmit={handleAddMealSubmit}
                    onClose={onCloseAddMeal}
                />
            )}
            {isLoading && (
                <Flex
                    position={'fixed'}
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg={'rgba(0, 0, 0, 0.5)'}
                    zIndex={9999}
                >
                    <Spinner size={'xl'} color={keyColors.primary} margin={'auto'} />
                </Flex>
            )}
            {mealPlanPendingDelete && (
                <AreYouSure
                    title={'Delete Meal Plan?'}
                    message={
                        'Are you sure you want to delete this meal plan? This action cannot be undone.'
                    }
                    onCancel={onCancelDeleteMeal}
                    onConfirm={onConfirmDeleteMeal}
                />
            )}
            <NavBar />
            <Stack
                w={'full'}
                p={{ base: 2, md: 4 }}
                justifyContent={'center'}
                alignItems={'start'}
                gap={{ base: 4, md: 6 }}
                boxSizing={'border-box'}
                direction={{ base: 'column', lg: 'row' }}
            >
                <MealPlannerCalendars onDateRangeSelected={onDateRangeSelected} />
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    w={0.5}
                    alignSelf={'stretch'}
                    bg={keyColors.primary}
                />
                <VStack flex={1} gap={4}>
                    {meals.map(([day, meals]) => (
                        <DaysMeals
                            key={day.toISOString()}
                            day={day}
                            meals={meals}
                            onAddMeal={onAddMeal}
                            onDeleteMeal={onDeleteMeal}
                            onEditMeal={onEditMeal}
                        />
                    ))}
                </VStack>
            </Stack>
        </VStack>
    )
}
