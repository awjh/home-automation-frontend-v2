'use client'

import { DeleteMealPlanResponse, PostMealPlanResponse } from '@awjh/home-automation-v2-api-models'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import FlowSource from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/FlowSource'
import MealPlanPopups from '@features/MealPlanner/MealPlanPopups/MealPlanPopups'
import NavBar from '@features/NavBar/NavBar'
import { RecipeMealPlanDate } from '@features/Recipes/ViewRecipe/RecipeMealPlans/RecipeMealPlans'
import ViewRecipe from '@features/Recipes/ViewRecipe/ViewRecipe'
import useColorMode from '@hooks/useColorMode'
import useToaster from '@hooks/useToaster'
import formatAuthors from '@utils/formatAuthors'
import { formatDate } from '@utils/formatDate'
import { useCallback, useMemo, useState } from 'react'

export interface RecipeScreenProps {
    recipe: Recipe
    dates: RecipeMealPlanDate[]
    onAddMealSubmit: (values: AddMealPlanFormValues) => Promise<PostMealPlanResponse>
    onDeleteMealSubmit: (
        mealPlan: Pick<MealPlan, 'date' | 'mealTime' | 'course'>,
    ) => Promise<DeleteMealPlanResponse>
}

export default function RecipeScreen({
    recipe,
    dates,
    onAddMealSubmit,
    onDeleteMealSubmit,
}: RecipeScreenProps) {
    const { keyColors } = useColorMode()
    const toaster = useToaster()
    const [mealPlanDates, setMealPlanDates] = useState(dates)

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

    const handleMealPlanSubmit = useCallback(
        async (values: AddMealPlanFormValues) => {
            if (values.source === SourceType.LEFTOVERS) {
                return onAddMealSubmit(values)
            }

            const submittedValues: AddMealPlanFormValues = {
                ...values,
                mealDate: values.mealDate,
                source: SourceType.INTERNAL_RECIPE,
                useForLeftovers: false,
                leftoversDate: '',
                title: recipe.title,
                author: formatAuthors(recipe.authors),
                fromDate: '',
                fromMealTime: '',
                fromCourse: '',
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

            return onAddMealSubmit(submittedValues)
        },
        [onAddMealSubmit, recipe],
    )

    const onAddMealSuccess = useCallback(
        (response: PostMealPlanResponse, values: AddMealPlanFormValues) => {
            // Only update the recipe date highlights for the primary internal recipe add.
            // Leftovers follow-up submissions should be persisted but not reflected here.
            if (values.source !== SourceType.INTERNAL_RECIPE) {
                return
            }

            const course = values.course

            if (!course) {
                throw new Error('Course is required for recipe meal plans')
            }

            setMealPlanDates((currentDates) => [
                ...currentDates,
                {
                    date: response.date,
                    mealTime: response.mealTime,
                    course,
                },
            ])
        },
        [],
    )

    const createAddInitialValues = useCallback(
        (day: Date) => ({
            mealDate: formatDate(day),
            ...internalRecipeInitialValues,
        }),
        [internalRecipeInitialValues],
    )

    const onRecipeDateClick = useCallback(
        (
            date: string,
            controls: {
                onAddMeal: (day: Date) => void
                onDeleteMeal: (mealPlan: RecipeMealPlanDate) => void
            },
        ) => {
            const existingMealPlanDate = mealPlanDates.find(
                (mealPlanDate) => mealPlanDate.date === date,
            )

            if (existingMealPlanDate) {
                controls.onDeleteMeal(existingMealPlanDate)
                return
            }

            // recipe meal dates sends the default date as from the start of the week
            // usually when adding meal plans its as we're shopping for next week
            // so we add 7 days for handiness
            const [year, month, day] = date.split('-').map(Number)
            const nextWeek = new Date(year, month - 1, day)
            nextWeek.setDate(nextWeek.getDate() + 7)
            controls.onAddMeal(nextWeek)
        },
        [mealPlanDates],
    )

    const unsupportedRecipePopupAction = useCallback(async () => {
        throw new Error('Unsupported in recipe meal plan popup flow')
    }, [])

    const onDeleteMealSuccess = useCallback(
        (deletedMealPlan: DeleteMealPlanResponse) => {
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

            const datesOfRelatedMealPlans = new Set(
                (deletedMealPlan.relatedMealPlans ?? []).map(({ date }) => date),
            )

            let description = `The meal plan for ${deletedMealPlan.date.split('-').reverse().join('/')} has been successfully deleted.`

            if (datesOfRelatedMealPlans.size === 1) {
                description += ` Related meal plan${datesOfRelatedMealPlans.size === 1 ? '' : 's'} for ${Array.from(
                    datesOfRelatedMealPlans,
                )
                    .map((date) => date.split('-').reverse().join('/'))
                    .join(', ')} have also been deleted.`
            }

            toaster.create({
                title: 'Deleted meal plan',
                description,
                type: 'success',
            })
        },
        [toaster],
    )

    return (
        <VStack width={'full'}>
            <NavBar />
            <MealPlanPopups<RecipeMealPlanDate, DeleteMealPlanResponse>
                flowSource={FlowSource.RECIPE_PAGE}
                createAddInitialValues={createAddInitialValues}
                extractTitleFromOnlineSource={unsupportedRecipePopupAction}
                searchInternalRecipes={unsupportedRecipePopupAction}
                onAddMealSubmit={handleMealPlanSubmit}
                onAddMealSuccess={onAddMealSuccess}
                onDeleteMealSubmit={onDeleteMealSubmit}
                onDeleteMealSuccess={onDeleteMealSuccess}
            >
                {({ onAddMeal, onDeleteMeal }) => (
                    <VStack width={'full'} minHeight={'100vh'} borderColor={keyColors.primary}>
                        <ViewRecipe
                            recipe={recipe}
                            dates={mealPlanDates}
                            onDateClick={(date) =>
                                onRecipeDateClick(date, {
                                    onAddMeal,
                                    onDeleteMeal: (mealPlan) => onDeleteMeal(mealPlan),
                                })
                            }
                        />
                    </VStack>
                )}
            </MealPlanPopups>
        </VStack>
    )
}
