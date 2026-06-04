'use client'

import { PostMealPlanResponse } from '@awjh/home-automation-v2-api-models'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import AddMealPlan from '@features/MealPlanner/AddMealPlan/AddMealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import FlowSource from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/FlowSource'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import NavBar from '@features/NavBar/NavBar'
import { RecipeMealPlanDate } from '@features/Recipes/ViewRecipe/RecipeMealPlans/RecipeMealPlans'
import ViewRecipe from '@features/Recipes/ViewRecipe/ViewRecipe'
import useColorMode from '@hooks/useColorMode'
import AreYouSure from '@molecules/AreYouSure/AreYouSure'
import formatAuthors from '@utils/formatAuthors'
import { formatDate } from '@utils/formatDate'
import { useCallback, useMemo, useState } from 'react'

export interface RecipeScreenProps {
    recipe: Recipe
    dates: RecipeMealPlanDate[]
    onAddMealSubmit: (values: AddMealPlanFormValues) => Promise<PostMealPlanResponse>
    onDeleteMealSubmit: (
        mealPlan: Pick<MealPlan, 'date' | 'mealTime' | 'course'>,
    ) => Promise<Pick<MealPlan, 'date' | 'mealTime' | 'course'>>
}

export default function RecipeScreen({
    recipe,
    dates,
    onAddMealSubmit,
    onDeleteMealSubmit,
}: RecipeScreenProps) {
    const { keyColors } = useColorMode()
    const [mealPlanDates, setMealPlanDates] = useState(dates)
    const [pendingMealDate, setPendingMealDate] = useState<string | null>(null)
    const [mealPlanPendingDelete, setMealPlanPendingDelete] = useState<Pick<
        MealPlan,
        'date' | 'mealTime' | 'course'
    > | null>(null)

    const internalRecipeInitialValues = useMemo(
        () => ({
            source: SourceType.INTERNAL_RECIPE,
            internalRecipeId: recipe.id,
            title: recipe.title,
            author: formatAuthors(recipe.authors),
            prepDuration: recipe.duration.prepDuration.toString(),
            cookingDuration: recipe.duration.cookingDuration.toString(),
            standingTime: recipe.duration.standingTime.toString(),
        }),
        [recipe],
    )

    const onDateClick = useCallback(
        (date: string) => {
            const existingMealPlanDate = mealPlanDates.find(
                (mealPlanDate) => mealPlanDate.date === date,
            )

            if (existingMealPlanDate) {
                setMealPlanPendingDelete(existingMealPlanDate)
                return
            }

            // recipe meal dates sends the default date as from the start of the week
            // usually when adding meal plans its as we're shopping for next week
            // so we add 7 days for handiness

            const [year, month, day] = date.split('-').map(Number)
            const nextWeek = new Date(year, month - 1, day)
            nextWeek.setDate(nextWeek.getDate() + 7)
            const dateToAdd = formatDate(nextWeek)
            setPendingMealDate(dateToAdd)
        },
        [mealPlanDates],
    )

    const onCloseMealPlan = useCallback(() => {
        setPendingMealDate(null)
    }, [])

    const handleMealPlanSubmit = useCallback(
        async (values: AddMealPlanFormValues) => {
            if (!pendingMealDate) {
                return
            }

            // TODO need to handle when they want leftovers so it does that flow once done ideally I think - test it out if can?

            const submittedValues: AddMealPlanFormValues = {
                ...values,
                mealDate: values.mealDate,
                source: SourceType.INTERNAL_RECIPE,
                useForLeftovers: false,
                leftoversDate: '',
                title: recipe.title,
                author: formatAuthors(recipe.authors),
                fromDate: '',
                bookTitle: '',
                pageNumber: '',
                series: '',
                recipeUrl: '',
                magazineName: '',
                magazineIssue: '',
                magazinePage: '',
                internalRecipeId: recipe.id,
                prepDuration: recipe.duration.prepDuration.toString(),
                cookingDuration: recipe.duration.cookingDuration.toString(),
                standingTime: recipe.duration.standingTime.toString(),
            }

            await onAddMealSubmit(submittedValues)

            const createdMealPlan = createMealPlanFromFormValues(submittedValues)

            setMealPlanDates((currentDates) => [
                ...currentDates,
                {
                    date: createdMealPlan.date,
                    mealTime: createdMealPlan.mealTime,
                    course: createdMealPlan.course,
                },
            ])
            setPendingMealDate(null)

            if (submittedValues.useForLeftovers) {
                // TODO
            }
        },
        [onAddMealSubmit, pendingMealDate, recipe],
    )

    const onCancelDeleteMeal = useCallback(() => {
        setMealPlanPendingDelete(null)
    }, [])

    const onConfirmDeleteMeal = useCallback(async () => {
        if (!mealPlanPendingDelete) {
            return
        }

        const deletedMealPlan = await onDeleteMealSubmit(mealPlanPendingDelete)

        setMealPlanDates((currentDates) =>
            currentDates.filter(
                (mealPlanDate) =>
                    !(
                        mealPlanDate.date === deletedMealPlan.date &&
                        mealPlanDate.mealTime === deletedMealPlan.mealTime &&
                        mealPlanDate.course === deletedMealPlan.course
                    ),
            ),
        )

        setMealPlanPendingDelete(null)
    }, [mealPlanPendingDelete, onDeleteMealSubmit])

    return (
        <VStack width={'full'}>
            {pendingMealDate && (
                <AddMealPlan
                    flowSource={FlowSource.RECIPE_PAGE}
                    mode={'add'}
                    initialValues={{
                        mealDate: pendingMealDate,
                        ...internalRecipeInitialValues,
                    }}
                    isSourceEditable={false}
                    extractTitleFromOnlineSource={async () => {
                        alert("I'm not sure how you got here but you did, now go away!")
                        throw new Error('Not implemented')
                    }}
                    searchInternalRecipes={() => {
                        alert("I'm not sure how you got here but you did, now go away!")
                        throw new Error('Not implemented')
                    }}
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
            <NavBar />
            <VStack width={'full'} minHeight={'100vh'} borderColor={keyColors.primary}>
                <ViewRecipe recipe={recipe} dates={mealPlanDates} onDateClick={onDateClick} />
            </VStack>
        </VStack>
    )
}
