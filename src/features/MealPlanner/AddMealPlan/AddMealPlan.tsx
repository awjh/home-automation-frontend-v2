'use client'

import {
    GetExtractedExternalRecipeBasicsResponse,
    GetRecipesResponse,
} from '@awjh/home-automation-v2-api-models'
import PopupForm from '@molecules/PopupForm/PopupForm'
import AddMealPlanForm from './AddMealPlanForm/AddMealPlanForm'
import AddMealPlanFormValues from './AddMealPlanForm/defs/AddMealPlanFormValues'
import FlowSource from './AddMealPlanForm/defs/FlowSource'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

interface AddMealPlanProps {
    extractTitleFromOnlineSource: (url: string) => Promise<GetExtractedExternalRecipeBasicsResponse>
    initialValues: Partial<AddMealPlanFormValues> & { mealDate: string }
    isSourceEditable: boolean
    mode: 'add' | 'edit'
    flowSource: FlowSource
    searchInternalRecipes: (keywords: string) => Promise<GetRecipesResponse>
    onSubmit: (values: AddMealPlanFormValues) => void | Promise<void>
    onClose: () => void
}

export default function AddMealPlan(props: AddMealPlanProps) {
    const headingPrefix = props.mode === 'edit' ? 'Edit meal for' : 'Add meal for'

    let heading = `${headingPrefix} ${props.initialValues?.mealDate?.split('-').reverse().join('/')}`

    if (props.flowSource === FlowSource.RECIPE_PAGE) {
        if (props.initialValues?.source === SourceType.LEFTOVERS) {
            heading = 'Setup leftovers meal plan for recipe'
        } else {
            heading = 'Setup meal plan for recipe'
        }
    }

    const formKey = `${props.mode}:${props.initialValues.mealDate}:${props.flowSource}:${JSON.stringify(props.initialValues ?? {})}`

    return (
        <PopupForm
            dataProps={{
                testid: 'add-meal-plan-modal',
                mode: props.mode,
                mealdate: props.initialValues.mealDate,
            }}
            heading={heading}
            onClose={props.onClose}
        >
            <AddMealPlanForm
                key={formKey}
                flowSource={props.flowSource}
                initialValues={props.initialValues}
                isMealTimeEditable={props.mode === 'add'}
                isCourseEditable={props.mode === 'add'}
                isSourceEditable={props.isSourceEditable}
                showUseForLeftoversQuestion={props.mode === 'add'}
                searchInternalRecipes={props.searchInternalRecipes}
                extractTitleFromOnlineSource={props.extractTitleFromOnlineSource}
                onSubmit={props.onSubmit}
                onCancel={props.onClose}
            />
        </PopupForm>
    )
}
