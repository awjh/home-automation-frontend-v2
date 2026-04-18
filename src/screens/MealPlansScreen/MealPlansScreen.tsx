'use client'

import {
    GetExtractedExternalRecipeResponse,
    PostMealPlanResponse,
    PutMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import { Flex, Spinner, VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import AddMealPlan from '@features/MealPlanner/AddMealPlan/AddMealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import { SearchInternalRecipes } from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/steps/AddMealPlanInternalRecipeStep/AddMealPlanInternalRecipeStep'
import createInitialFormValuesFromMealPlan, {
    createInitialLeftoversFormValuesFromMealPlan,
} from '@features/MealPlanner/AddMealPlan/utils/createInitialFormValuesFromMealPlan'
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
    onEditMealSubmit: (
        mealPlan: MealPlan,
        values: AddMealPlanFormValues,
    ) => Promise<PutMealPlanResponse>
    onDeleteMealSubmit: (mealPlan: MealPlan) => Promise<Pick<MealPlan, 'date' | 'mealTime'>>
}

const defaultSearchInternalRecipes: SearchInternalRecipes = async () => []

interface PendingAddMealState {
    date: Date
    initialValues?: Partial<AddMealPlanFormValues>
    isSourceEditable: boolean
}

function createDateFromIsoDateString(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number)

    return new Date(year, month - 1, day)
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
    searchInternalRecipes = defaultSearchInternalRecipes,
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
    const [pendingAddMeal, setPendingAddMeal] = useState<PendingAddMealState | null>(null)
    const [mealPlanPendingEdit, setMealPlanPendingEdit] = useState<MealPlan | null>(null)
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
        setPendingAddMeal({
            date: day,
            isSourceEditable: true,
        })
    }, [])

    const onCloseAddMeal = useCallback(() => {
        setPendingAddMeal(null)
    }, [])

    const onCloseEditMeal = useCallback(() => {
        setMealPlanPendingEdit(null)
    }, [])

    const handleAddMealSubmit = useCallback(
        async (values: AddMealPlanFormValues) => {
            if (!pendingAddMeal) {
                return
            }

            const mealDate = formatDate(pendingAddMeal.date)

            await onAddMealSubmit(mealDate, values)

            const createdMealPlan = createMealPlanFromFormValues(mealDate, values)

            setMeals((currentMeals) => [...currentMeals, createdMealPlan])

            if (values.source !== 'leftovers' && values.useForLeftovers) {
                setPendingAddMeal({
                    date: createDateFromIsoDateString(values.leftoversDate),
                    initialValues: createInitialLeftoversFormValuesFromMealPlan(createdMealPlan),
                    isSourceEditable: false,
                })
                return
            }

            setPendingAddMeal(null)
        },
        [onAddMealSubmit, pendingAddMeal],
    )

    const onDeleteMeal = useCallback((mealPlan: MealPlan) => {
        setMealPlanPendingDelete(mealPlan)
    }, [])

    const onEditMeal = useCallback((mealPlan: MealPlan) => {
        setMealPlanPendingEdit(mealPlan)
    }, [])

    const handleEditMealSubmit = useCallback(
        async (values: AddMealPlanFormValues) => {
            if (!mealPlanPendingEdit) {
                return
            }

            await onEditMealSubmit(mealPlanPendingEdit, values)

            const updatedMealPlan = {
                ...createMealPlanFromFormValues(mealPlanPendingEdit.date, {
                    ...values,
                    mealTime: mealPlanPendingEdit.mealTime,
                }),
                mealTime: mealPlanPendingEdit.mealTime,
            }

            setMeals((currentMeals) =>
                currentMeals.map((mealPlan) =>
                    mealPlan.date === mealPlanPendingEdit.date &&
                    mealPlan.mealTime === mealPlanPendingEdit.mealTime
                        ? updatedMealPlan
                        : mealPlan,
                ),
            )

            setMealPlanPendingEdit(null)
        },
        [mealPlanPendingEdit, onEditMealSubmit],
    )

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
            {pendingAddMeal && (
                <AddMealPlan
                    date={formatDate(pendingAddMeal.date)}
                    initialValues={pendingAddMeal.initialValues}
                    extractTitleFromOnlineSource={extractTitleFromOnlineSource}
                    isSourceEditable={pendingAddMeal.isSourceEditable}
                    searchInternalRecipes={searchInternalRecipes}
                    onSubmit={handleAddMealSubmit}
                    onClose={onCloseAddMeal}
                    mode={'add'}
                />
            )}
            {mealPlanPendingEdit && (
                <AddMealPlan
                    date={mealPlanPendingEdit.date}
                    mode={'edit'}
                    initialValues={createInitialFormValuesFromMealPlan(mealPlanPendingEdit)}
                    isSourceEditable={true}
                    extractTitleFromOnlineSource={extractTitleFromOnlineSource}
                    searchInternalRecipes={searchInternalRecipes}
                    onSubmit={handleEditMealSubmit}
                    onClose={onCloseEditMeal}
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
