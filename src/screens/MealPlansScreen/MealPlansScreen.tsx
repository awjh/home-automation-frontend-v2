'use client'

import {
    GetExtractedExternalRecipeResponse,
    GetRecipesResponse,
    PostMealPlanResponse,
    PutMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import { Flex, Spinner, VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import AddMealPlan from '@features/MealPlanner/AddMealPlan/AddMealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import FlowSource from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/FlowSource'
import createInitialFormValuesFromMealPlan, {
    createInitialLeftoversFormValuesFromMealPlan,
} from '@features/MealPlanner/AddMealPlan/utils/createInitialFormValuesFromMealPlan'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import ViewMealPlans from '@features/MealPlanner/ViewMealPlans/ViewMealPlans'
import NavBar from '@features/NavBar/NavBar'
import useColorMode from '@hooks/useColorMode'
import AreYouSure from '@molecules/AreYouSure/AreYouSure'
import { formatDate } from '@utils/formatDate'
import { useCallback, useRef, useState } from 'react'

export interface MealPlansScreenProps {
    getMealPlansForDateRange: (startDate: Date, endDate: Date) => Promise<MealPlan[]>
    initialMeals: MealPlan[]
    initialDate: Date
    extractTitleFromOnlineSource: (url: string) => Promise<GetExtractedExternalRecipeResponse>
    searchInternalRecipes: (keywords: string) => Promise<GetRecipesResponse>
    onAddMealSubmit: (values: AddMealPlanFormValues) => Promise<PostMealPlanResponse>
    onEditMealSubmit: (
        mealPlan: MealPlan,
        values: AddMealPlanFormValues,
    ) => Promise<PutMealPlanResponse>
    onDeleteMealSubmit: (
        mealPlan: MealPlan,
    ) => Promise<Pick<MealPlan, 'date' | 'mealTime' | 'course'>>
}

interface PendingAddMealState {
    initialValues: Partial<AddMealPlanFormValues> & { mealDate: string }
    isSourceEditable: boolean
}

type PendingMealPlanState =
    | {
          mode: 'add'
          initialValues: PendingAddMealState['initialValues']
          isSourceEditable: boolean
      }
    | {
          mode: 'edit'
          mealPlan: MealPlan
          initialValues: AddMealPlanFormValues
          isSourceEditable: boolean
      }

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
    searchInternalRecipes,
    onAddMealSubmit,
    onEditMealSubmit,
    onDeleteMealSubmit,
}: MealPlansScreenProps) {
    const { keyColors } = useColorMode()

    const [isLoading, setIsLoading] = useState(false)
    const [meals, setMeals] = useState(initialMeals)
    const [selectedDateRange, setSelectedDateRange] = useState(() =>
        getDateRangeForWeek(initialDate),
    )
    const [pendingMealPlan, setPendingMealPlan] = useState<PendingMealPlanState | null>(null)
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
        setPendingMealPlan({
            mode: 'add',
            initialValues: { mealDate: formatDate(day) },
            isSourceEditable: true,
        })
    }, [])

    const onCloseMealPlan = useCallback(() => {
        setPendingMealPlan(null)
    }, [])

    const handleMealPlanSubmit = useCallback(
        async (values: AddMealPlanFormValues) => {
            if (!pendingMealPlan) {
                return
            }

            if (pendingMealPlan.mode === 'add') {
                await onAddMealSubmit(values)

                const createdMealPlan = createMealPlanFromFormValues(values)

                setMeals((currentMeals) => [...currentMeals, createdMealPlan])

                if (values.source !== 'leftovers' && values.useForLeftovers) {
                    setPendingMealPlan({
                        mode: 'add',
                        initialValues: createInitialLeftoversFormValuesFromMealPlan(
                            createdMealPlan,
                            values.leftoversDate,
                        ),
                        isSourceEditable: false,
                    })
                    return
                }

                setPendingMealPlan(null)
                return
            }

            await onEditMealSubmit(pendingMealPlan.mealPlan, values)

            const updatedMealPlan = {
                ...createMealPlanFromFormValues({
                    ...values,
                    mealTime: pendingMealPlan.mealPlan.mealTime,
                    course: pendingMealPlan.mealPlan.course,
                }),
                mealTime: pendingMealPlan.mealPlan.mealTime,
                course: pendingMealPlan.mealPlan.course,
            }

            setMeals((currentMeals) =>
                currentMeals.map((mealPlan) =>
                    mealPlan.date === pendingMealPlan.mealPlan.date &&
                    mealPlan.mealTime === pendingMealPlan.mealPlan.mealTime &&
                    mealPlan.course === pendingMealPlan.mealPlan.course
                        ? updatedMealPlan
                        : mealPlan,
                ),
            )

            setPendingMealPlan(null)
        },
        [onAddMealSubmit, onEditMealSubmit, pendingMealPlan],
    )

    const onDeleteMeal = useCallback((mealPlan: MealPlan) => {
        setMealPlanPendingDelete(mealPlan)
    }, [])

    const onEditMeal = useCallback((mealPlan: MealPlan) => {
        setPendingMealPlan({
            mode: 'edit',
            mealPlan,
            initialValues: createInitialFormValuesFromMealPlan(mealPlan),
            isSourceEditable: true,
        })
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
                        mealPlan.mealTime === deletedMealPlan.mealTime &&
                        mealPlan.course === deletedMealPlan.course
                    ),
            ),
        )

        setMealPlanPendingDelete(null)
    }, [mealPlanPendingDelete, onDeleteMealSubmit])

    return (
        <VStack width={'full'} minHeight={'100vh'}>
            {pendingMealPlan && (
                <AddMealPlan
                    flowSource={FlowSource.MEAL_PLANNER}
                    mode={pendingMealPlan.mode}
                    initialValues={pendingMealPlan.initialValues}
                    extractTitleFromOnlineSource={extractTitleFromOnlineSource}
                    isSourceEditable={pendingMealPlan.isSourceEditable}
                    searchInternalRecipes={searchInternalRecipes}
                    onSubmit={handleMealPlanSubmit}
                    onClose={onCloseMealPlan}
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
