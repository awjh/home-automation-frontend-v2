'use client'

import {
    DeleteMealPlanResponse,
    GetExtractedExternalRecipeBasicsResponse,
    GetRecipesResponse,
    PostMealPlanResponse,
    PutMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import MealPlan from '@defs/MealPlan'
import AddMealPlan from '@features/MealPlanner/AddMealPlan/AddMealPlan'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import FlowSource from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/FlowSource'
import createInitialFormValuesFromMealPlan, {
    createInitialLeftoversFormValuesFromMealPlan,
} from '@features/MealPlanner/AddMealPlan/utils/createInitialFormValuesFromMealPlan'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import AreYouSure from '@molecules/AreYouSure/AreYouSure'
import { formatDate } from '@utils/formatDate'
import { ReactNode, useCallback, useState } from 'react'

type MealPlanKey = Pick<MealPlan, 'date' | 'mealTime' | 'course'>

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

export interface MealPlanPopupControls<TMeal extends MealPlanKey = MealPlanKey> {
    onAddMeal: (day: Date) => void
    onDeleteMeal: (mealPlan: TMeal) => void
    onEditMeal: (mealPlan: MealPlan) => void
}

interface MealPlanPopupsBaseProps<
    TMeal extends MealPlanKey,
    TDeleteMealResponse extends MealPlanKey,
> {
    onAddMealSubmit: (values: AddMealPlanFormValues) => Promise<PostMealPlanResponse>
    onAddMealSuccess: (response: PostMealPlanResponse, values: AddMealPlanFormValues) => void
    onDeleteMealSubmit: (mealPlan: TMeal) => Promise<TDeleteMealResponse>
    onDeleteMealSuccess: (mealPlan: TDeleteMealResponse) => void
    extractTitleFromOnlineSource: (url: string) => Promise<GetExtractedExternalRecipeBasicsResponse>
    searchInternalRecipes: (keywords: string) => Promise<GetRecipesResponse>
    children: (controls: MealPlanPopupControls<TMeal>) => ReactNode
}

interface MealPlanPopupsMealPlannerProps extends MealPlanPopupsBaseProps<
    MealPlan,
    DeleteMealPlanResponse
> {
    flowSource: FlowSource.MEAL_PLANNER
    createAddInitialValues?: (day: Date) => Partial<AddMealPlanFormValues> & { mealDate: string }
    onEditMealSubmit: (
        mealPlan: MealPlan,
        values: AddMealPlanFormValues,
    ) => Promise<PutMealPlanResponse>
    onEditMealSuccess: (
        mealPlan: MealPlan,
        response: PutMealPlanResponse,
        values: AddMealPlanFormValues,
    ) => void
}

interface MealPlanPopupsRecipePageProps<
    TMeal extends MealPlanKey,
    TDeleteMealResponse extends MealPlanKey = TMeal,
> extends MealPlanPopupsBaseProps<TMeal, TDeleteMealResponse> {
    flowSource: FlowSource.RECIPE_PAGE
    createAddInitialValues: (day: Date) => Partial<AddMealPlanFormValues> & { mealDate: string }
    onEditMealSubmit?: never
    onEditMealSuccess?: never
}

type MealPlanPopupsProps<
    TMeal extends MealPlanKey = MealPlan,
    TDeleteMealResponse extends MealPlanKey = TMeal,
> = MealPlanPopupsMealPlannerProps | MealPlanPopupsRecipePageProps<TMeal, TDeleteMealResponse>

export default function MealPlanPopups<
    TMeal extends MealPlanKey = MealPlan,
    TDeleteMealResponse extends MealPlanKey = TMeal,
>(props: MealPlanPopupsProps<TMeal, TDeleteMealResponse>) {
    const {
        flowSource,
        createAddInitialValues,
        extractTitleFromOnlineSource,
        searchInternalRecipes,
        onAddMealSubmit,
        onAddMealSuccess,
    } = props
    const mealPlannerProps =
        flowSource === FlowSource.MEAL_PLANNER ? (props as MealPlanPopupsMealPlannerProps) : null

    const [pendingMealPlan, setPendingMealPlan] = useState<PendingMealPlanState | null>(null)
    const [mealPlanPendingDelete, setMealPlanPendingDelete] = useState<TMeal | null>(null)

    const onAddMeal = useCallback(
        (day: Date) => {
            setPendingMealPlan({
                mode: 'add',
                initialValues: createAddInitialValues
                    ? createAddInitialValues(day)
                    : { mealDate: formatDate(day) },
                isSourceEditable: flowSource === FlowSource.MEAL_PLANNER,
            })
        },
        [createAddInitialValues, flowSource],
    )

    const onCloseMealPlan = useCallback(() => {
        setPendingMealPlan(null)
    }, [])

    const handleMealPlanSubmit = useCallback(
        async (values: AddMealPlanFormValues) => {
            if (!pendingMealPlan) {
                return
            }

            if (pendingMealPlan.mode === 'add') {
                const addMealResponse = await onAddMealSubmit(values)

                onAddMealSuccess(addMealResponse, values)

                if (values.source !== 'leftovers' && values.useForLeftovers) {
                    const createdMealPlan = createMealPlanFromFormValues(values)

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

            if (flowSource !== FlowSource.MEAL_PLANNER) {
                return
            }

            if (!mealPlannerProps) {
                return
            }

            const { onEditMealSubmit, onEditMealSuccess } = mealPlannerProps

            const editMealResponse = await onEditMealSubmit(pendingMealPlan.mealPlan, values)

            onEditMealSuccess(pendingMealPlan.mealPlan, editMealResponse, values)

            setPendingMealPlan(null)
        },
        [flowSource, mealPlannerProps, onAddMealSubmit, onAddMealSuccess, pendingMealPlan],
    )

    const onDeleteMeal = useCallback((mealPlan: TMeal) => {
        setMealPlanPendingDelete(mealPlan)
    }, [])

    const onEditMeal = useCallback(
        (mealPlan: MealPlan) => {
            if (!mealPlannerProps) {
                return
            }

            setPendingMealPlan({
                mode: 'edit',
                mealPlan,
                initialValues: createInitialFormValuesFromMealPlan(mealPlan),
                isSourceEditable: true,
            })
        },
        [mealPlannerProps],
    )

    const onCancelDeleteMeal = useCallback(() => {
        setMealPlanPendingDelete(null)
    }, [])

    const onConfirmDeleteMeal = useCallback(async () => {
        if (!mealPlanPendingDelete) {
            return
        }

        if (flowSource === FlowSource.MEAL_PLANNER && mealPlannerProps) {
            const deletedMealPlan = await mealPlannerProps.onDeleteMealSubmit(
                mealPlanPendingDelete as unknown as MealPlan,
            )

            mealPlannerProps.onDeleteMealSuccess(deletedMealPlan)
        } else {
            const recipePageProps = props as MealPlanPopupsRecipePageProps<
                TMeal,
                TDeleteMealResponse
            >
            const deletedMealPlan = await recipePageProps.onDeleteMealSubmit(
                mealPlanPendingDelete as TMeal,
            )

            recipePageProps.onDeleteMealSuccess(deletedMealPlan)
        }

        setMealPlanPendingDelete(null)
    }, [flowSource, mealPlanPendingDelete, mealPlannerProps, props])

    const renderedChildren =
        flowSource === FlowSource.MEAL_PLANNER && mealPlannerProps
            ? mealPlannerProps.children({
                  onAddMeal,
                  onDeleteMeal: onDeleteMeal as unknown as (mealPlan: MealPlan) => void,
                  onEditMeal,
              })
            : (props as MealPlanPopupsRecipePageProps<TMeal, TDeleteMealResponse>).children({
                  onAddMeal,
                  onDeleteMeal,
                  onEditMeal,
              })

    return (
        <>
            {pendingMealPlan && (
                <AddMealPlan
                    flowSource={flowSource}
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
                        'Are you sure you want to delete this meal plan? This will also delete any leftovers based off this meal. This action cannot be undone.'
                    }
                    onCancel={onCancelDeleteMeal}
                    onConfirm={onConfirmDeleteMeal}
                />
            )}
            {renderedChildren}
        </>
    )
}
