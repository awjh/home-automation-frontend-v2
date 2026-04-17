'use client'

import {
    GetExtractedExternalRecipeResponse,
    PostMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import { Flex, Spinner, VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import AddMealPlan from '@features/MealPlanner/AddMealPlan/AddMealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import { SearchInternalRecipes } from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/steps/AddMealPlanInternalRecipeStep/AddMealPlanInternalRecipeStep'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import NavBar from '@features/NavBar/NavBar'
import ViewMealPlans from '@features/MealPlanner/ViewMealPlans/ViewMealPlans'
import useColorMode from '@hooks/useColorMode'
import AreYouSure from '@molecules/AreYouSure/AreYouSure'
import { formatDate } from '@utils/formatDate'
import { useCallback, useRef, useState } from 'react'

export interface MealPlansScreenProps {
    getMealPlansForDateRange: (startDate: Date, endDate: Date) => Promise<MealPlan[]>
    initialMeals: MealPlan[]
    initialDate: Date
    extractTitleFromOnlineSource: (url: string) => Promise<GetExtractedExternalRecipeResponse>
    searchInternalRecipes?: SearchInternalRecipes
    onAddMealSubmit: (date: string, values: AddMealPlanFormValues) => Promise<PostMealPlanResponse>
    onDeleteMealSubmit: (mealPlan: MealPlan) => Promise<Pick<MealPlan, 'date' | 'mealTime'>>
}

const defaultSearchInternalRecipes: SearchInternalRecipes = async () => []

function getDateRangeForWeek(date: Date) {
    const startDate = new Date(date)
    startDate.setDate(date.getDate() - date.getDay())

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    return { startDate, endDate }
}

export default function MealPlansScreen({
    getMealPlansForDateRange,
    initialMeals = [],
    initialDate,
    extractTitleFromOnlineSource,
    searchInternalRecipes = defaultSearchInternalRecipes,
    onAddMealSubmit,
    onDeleteMealSubmit,
}: MealPlansScreenProps) {
    const { keyColors } = useColorMode()

    const [isLoading, setIsLoading] = useState(false)
    const [meals, setMeals] = useState(initialMeals)
    const [selectedDateRange, setSelectedDateRange] = useState(() =>
        getDateRangeForWeek(initialDate),
    )
    const [addMealDate, setAddMealDate] = useState<Date | null>(null)
    const [mealPlanPendingDelete, setMealPlanPendingDelete] = useState<MealPlan | null>(null)
    const latestRequestId = useRef(0)

    const onDateRangeSelected = useCallback(
        async (startDate: Date, endDate: Date) => {
            const requestId = ++latestRequestId.current
            setSelectedDateRange({ startDate, endDate })
            setIsLoading(true)

            try {
                const nextMeals = await getMealPlansForDateRange(startDate, endDate)
                if (requestId === latestRequestId.current) {
                    setMeals(nextMeals)
                }

                return nextMeals
            } finally {
                if (requestId === latestRequestId.current) {
                    setIsLoading(false)
                }
            }
        },
        [getMealPlansForDateRange],
    )

    const onAddMeal = useCallback((day: Date) => {
        setAddMealDate(day)
    }, [])

    const onCloseAddMeal = useCallback(() => {
        setAddMealDate(null)
    }, [])

    const handleAddMealSubmit = useCallback(
        async (values: AddMealPlanFormValues) => {
            if (!addMealDate) {
                return
            }

            const mealDate = formatDate(addMealDate)

            await onAddMealSubmit(mealDate, values)

            const createdMealPlan = createMealPlanFromFormValues(mealDate, values)

            setMeals((currentMeals) => [...currentMeals, createdMealPlan])

            setAddMealDate(null)
        },
        [addMealDate, onAddMealSubmit],
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

        const deletedMealPlan = await onDeleteMealSubmit(mealPlanPendingDelete)

        setMeals((currentMeals) =>
            currentMeals.filter(
                (mealPlan) =>
                    !(
                        mealPlan.date === deletedMealPlan.date &&
                        mealPlan.mealTime === deletedMealPlan.mealTime
                    ),
            ),
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
            <VStack width={'full'} minHeight={'100vh'}>
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
                <NavBar />
                <ViewMealPlans
                    initialDate={initialDate}
                    meals={meals}
                    selectedDateRange={selectedDateRange}
                    onDateRangeSelected={onDateRangeSelected}
                    onAddMeal={onAddMeal}
                    onDeleteMeal={onDeleteMeal}
                    onEditMeal={onEditMeal}
                />
            </VStack>
        </VStack>
    )
}
