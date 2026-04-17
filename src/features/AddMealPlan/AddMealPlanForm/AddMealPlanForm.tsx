import { GetExtractedExternalRecipeResponse } from '@awjh/home-automation-v2-api-models'
import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import AddMealPlanFormValues from './defs/AddMealPlanFormValues'
import getFlowRules from './flows/getFlowRules'
import { SearchInternalRecipes } from './steps/AddMealPlanInternalRecipeStep/AddMealPlanInternalRecipeStep'
import AddMealPlanStepComponent from './steps/AddMealPlanStepComponent'

export interface AddMealPlanFormProps {
    extractTitleFromOnlineSource: (url: string) => Promise<GetExtractedExternalRecipeResponse>
    searchInternalRecipes: SearchInternalRecipes
    onSubmit: (values: AddMealPlanFormValues) => void | Promise<void>
    onCancel: () => void
}

export default function AddMealPlanForm({
    extractTitleFromOnlineSource,
    searchInternalRecipes,
    onSubmit,
    onCancel,
}: AddMealPlanFormProps) {
    const [currentStepNumber, setCurrentStepNumber] = useState(1)
    const {
        control,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<AddMealPlanFormValues>({
        defaultValues: {
            mealTime: '',
            source: '',
            title: '',
            author: '',
            fromDate: '',
            bookTitle: '',
            pageNumber: '',
            series: '',
            recipeUrl: '',
            magazineName: '',
            magazineIssue: '',
            magazinePage: '',
            internalRecipeId: '',
            prepDuration: '',
            cookingDuration: '',
            standingTime: '',
        },
        mode: 'onTouched',
    })

    const selectedSource = useWatch({ control, name: 'source' })

    const mealTimeItems = Object.values(MealTime).map((mealTime) => ({
        label: mealTime.replaceAll('_', ' '),
        value: mealTime,
    }))
    const sourceItems = Object.values(SourceType).map((sourceType) => ({
        label: sourceType.replaceAll('_', ' '),
        value: sourceType,
    }))
    const activeFlowRules = getFlowRules(selectedSource)
    const {
        stepMap: activeStepMap,
        titleAuthor: { showAuthor, authorLabel },
    } = activeFlowRules
    const lastStepNumber = Math.max(...Object.keys(activeStepMap).map(Number))
    const resolvedStepNumber = Math.min(currentStepNumber, lastStepNumber)
    const currentStep = activeStepMap[resolvedStepNumber] ?? 'primary'
    const isLastStep = resolvedStepNumber === lastStepNumber

    const handleFormSubmit = async (values: AddMealPlanFormValues) => {
        await onSubmit(values)
    }

    const handleBack = () => {
        setCurrentStepNumber(Math.max(resolvedStepNumber - 1, 1))
    }

    const handleStepBack = resolvedStepNumber === 1 ? onCancel : handleBack

    const handleAdvanceStep = async () => {
        if (isLastStep) {
            await handleSubmit(handleFormSubmit)()
            return
        }

        setCurrentStepNumber(Math.min(resolvedStepNumber + 1, lastStepNumber))
    }

    return (
        <AddMealPlanStepComponent
            step={currentStep}
            control={control}
            errors={errors}
            mealTimeItems={mealTimeItems}
            sourceItems={sourceItems}
            onBack={handleStepBack}
            onContinue={handleAdvanceStep}
            trigger={trigger}
            extractTitleFromOnlineSource={extractTitleFromOnlineSource}
            searchRecipes={searchInternalRecipes}
            setValue={setValue}
            authorLabel={authorLabel}
            showAuthor={showAuthor}
        />
    )
}
