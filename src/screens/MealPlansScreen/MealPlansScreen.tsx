'use client'

import {
    GetExtractedExternalRecipeResponse,
    GetRecipesResponse,
    PostMealPlanResponse,
    PutMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import { Flex, Spinner, VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import FlowSource from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/FlowSource'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import MealPlanPopups from '@features/MealPlanner/MealPlanPopups/MealPlanPopups'
import ViewMealPlans from '@features/MealPlanner/ViewMealPlans/ViewMealPlans'
import NavBar from '@features/NavBar/NavBar'
import useColorMode from '@hooks/useColorMode'
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

    const onAddMealSuccess = useCallback(
        (_: PostMealPlanResponse, values: AddMealPlanFormValues) => {
            const createdMealPlan = createMealPlanFromFormValues(values)

            setMeals((currentMeals) => [...currentMeals, createdMealPlan])
        },
        [],
    )

    const onEditMealSuccess = useCallback(
        (mealPlan: MealPlan, _: PutMealPlanResponse, values: AddMealPlanFormValues) => {
            const updatedMealPlan = {
                ...createMealPlanFromFormValues({
                    ...values,
                    mealTime: mealPlan.mealTime,
                    course: mealPlan.course,
                }),
                mealTime: mealPlan.mealTime,
                course: mealPlan.course,
            }

            setMeals((currentMeals) =>
                currentMeals.map((currentMealPlan) =>
                    currentMealPlan.date === mealPlan.date &&
                    currentMealPlan.mealTime === mealPlan.mealTime &&
                    currentMealPlan.course === mealPlan.course
                        ? updatedMealPlan
                        : currentMealPlan,
                ),
            )
        },
        [],
    )

    const onDeleteMealSuccess = useCallback(
        (deletedMealPlan: Pick<MealPlan, 'date' | 'mealTime' | 'course'>) => {
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
        },
        [],
    )

    return (
        <VStack width={'full'} minHeight={'100vh'}>
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
                <MealPlanPopups
                    flowSource={FlowSource.MEAL_PLANNER}
                    extractTitleFromOnlineSource={extractTitleFromOnlineSource}
                    searchInternalRecipes={searchInternalRecipes}
                    onAddMealSubmit={onAddMealSubmit}
                    onAddMealSuccess={onAddMealSuccess}
                    onEditMealSubmit={onEditMealSubmit}
                    onEditMealSuccess={onEditMealSuccess}
                    onDeleteMealSubmit={onDeleteMealSubmit}
                    onDeleteMealSuccess={onDeleteMealSuccess}
                >
                    {({ onAddMeal, onDeleteMeal, onEditMeal }) => (
                        <ViewMealPlans
                            initialDate={initialDate}
                            meals={meals}
                            selectedDateRange={selectedDateRange}
                            onDateRangeSelected={onDateRangeSelected}
                            onAddMeal={onAddMeal}
                            onDeleteMeal={onDeleteMeal}
                            onEditMeal={onEditMeal}
                        />
                    )}
                </MealPlanPopups>
            </VStack>
        </VStack>
    )
}
