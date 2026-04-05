import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import AddMealPlanBookStep from '@molecules/AddMealPlanBookStep/AddMealPlanBookStep'
import AddMealPlanDurationsStep from '@molecules/AddMealPlanDurationsStep/AddMealPlanDurationsStep'
import AddMealPlanInternalRecipeStep from '@molecules/AddMealPlanInternalRecipeStep/AddMealPlanInternalRecipeStep'
import AddMealPlanMagazineStep from '@molecules/AddMealPlanMagazineStep/AddMealPlanMagazineStep'
import AddMealPlanOnlineStep from '@molecules/AddMealPlanOnlineStep/AddMealPlanOnlineStep'
import AddMealPlanPrimaryStep from '@molecules/AddMealPlanPrimaryStep/AddMealPlanPrimaryStep'
import AddMealPlanTitleAuthorStep from '@molecules/AddMealPlanTitleAuthorStep/AddMealPlanTitleAuthorStep'
import { type ReactNode, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {
    AddMealPlanFormValues,
    AddMealPlanStep,
    InternalRecipeSearchParams,
    InternalRecipeSearchResult,
    SearchInternalRecipes,
} from './AddMealPlan.types'

export interface AddMealPlanFormProps {
    searchInternalRecipes?: SearchInternalRecipes
    onSubmit?: (values: AddMealPlanFormValues) => void | Promise<void>
}

type StepMap = Record<number, AddMealPlanStep>

interface TitleAuthorRules {
    showAuthor: boolean
    authorLabel: string
}

interface FlowRules {
    stepMap: StepMap
    titleAuthor: TitleAuthorRules
}

interface FlowRuleOverrides {
    stepMap?: StepMap
    titleAuthor?: Partial<TitleAuthorRules>
}

const fallbackInternalRecipes: InternalRecipeSearchResult[] = [
    {
        id: 'recipe-1',
        title: 'Spaghetti Bolognese',
        author: 'Andrew Hurt',
        duration: { prepDuration: 20, cookingDuration: 45, standingTime: 0 },
    },
    {
        id: 'recipe-2',
        title: 'Spaghetti Carbonara',
        author: 'Andrew Hurt',
        duration: { prepDuration: 10, cookingDuration: 20, standingTime: 0 },
    },
    {
        id: 'recipe-3',
        title: 'Vegetable Lasagne',
        author: 'Nigella Lawson',
        duration: { prepDuration: 30, cookingDuration: 50, standingTime: 10 },
    },
    {
        id: 'recipe-4',
        title: 'Creamy Chicken Pie',
        author: 'Mary Berry',
        duration: { prepDuration: 25, cookingDuration: 35, standingTime: 5 },
    },
    {
        id: 'recipe-5',
        title: 'Spicy Meatballs',
        author: 'Andrew Hurt',
        duration: { prepDuration: 15, cookingDuration: 30, standingTime: 0 },
    },
]

function fallbackSearchInternalRecipes({
    title,
    author,
}: InternalRecipeSearchParams): Promise<InternalRecipeSearchResult[]> {
    const normalizedTitle = title.toLowerCase()
    const normalizedAuthor = author.toLowerCase()

    return Promise.resolve(
        fallbackInternalRecipes.filter((recipe) => {
            const matchesTitle =
                !normalizedTitle || recipe.title.toLowerCase().includes(normalizedTitle)
            const matchesAuthor =
                !normalizedAuthor || recipe.author.toLowerCase().includes(normalizedAuthor)

            return matchesTitle && matchesAuthor
        }),
    )
}

const emptySourceStepMap: StepMap = {
    1: 'primary',
}

const defaultSourceStepMap: StepMap = {
    1: 'primary',
    2: 'details',
    3: 'durations',
}

const baseFlowRules: FlowRules = {
    stepMap: defaultSourceStepMap,
    titleAuthor: {
        showAuthor: true,
        authorLabel: 'Author',
    },
}

const sourceFlowRuleOverrides: Partial<Record<SourceType, FlowRuleOverrides>> = {
    [SourceType.BOOK]: {
        stepMap: {
            1: 'primary',
            2: 'details',
            3: 'book',
            4: 'durations',
        },
    },
    [SourceType.INTERNAL_RECIPE]: {
        stepMap: {
            1: 'primary',
            2: 'internalRecipe',
        },
    },
    [SourceType.MAGAZINE]: {
        stepMap: {
            1: 'primary',
            2: 'details',
            3: 'magazine',
            4: 'durations',
        },
    },
    [SourceType.ONLINE]: {
        stepMap: {
            1: 'primary',
            2: 'online',
            3: 'durations',
        },
    },
    [SourceType.FREEZER]: {
        titleAuthor: {
            showAuthor: false,
        },
    },
    [SourceType.READY_PREPARED]: {
        titleAuthor: {
            authorLabel: 'Producer',
        },
    },
}

function getFlowRules(source: SourceType | ''): FlowRules {
    if (source === '') {
        return {
            ...baseFlowRules,
            stepMap: emptySourceStepMap,
        }
    }

    const overrides = sourceFlowRuleOverrides[source]

    if (!overrides) {
        return baseFlowRules
    }

    return {
        stepMap: overrides.stepMap ?? baseFlowRules.stepMap,
        titleAuthor: {
            ...baseFlowRules.titleAuthor,
            ...overrides.titleAuthor,
        },
    }
}

export default function AddMealPlanForm({
    searchInternalRecipes = fallbackSearchInternalRecipes,
    onSubmit,
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
        await onSubmit?.(values)
    }

    const handleBack = () => {
        setCurrentStepNumber(Math.max(resolvedStepNumber - 1, 1))
    }

    const handleAdvanceStep = async () => {
        if (isLastStep) {
            await handleSubmit(handleFormSubmit)()
            return
        }

        setCurrentStepNumber(Math.min(resolvedStepNumber + 1, lastStepNumber))
    }

    const stepComponents: Record<AddMealPlanStep, ReactNode> = {
        primary: (
            <AddMealPlanPrimaryStep
                control={control}
                errors={errors}
                mealTimeItems={mealTimeItems}
                sourceItems={sourceItems}
                onCancel={() => undefined}
                onContinue={() => {
                    void handleAdvanceStep()
                }}
                trigger={trigger}
            />
        ),
        book: (
            <AddMealPlanBookStep
                control={control}
                errors={errors}
                onBack={handleBack}
                onContinue={() => {
                    void handleAdvanceStep()
                }}
                trigger={trigger}
            />
        ),
        details: (
            <AddMealPlanTitleAuthorStep
                control={control}
                errors={errors}
                onBack={handleBack}
                authorLabel={authorLabel}
                showAuthor={showAuthor}
                onContinue={() => {
                    void handleAdvanceStep()
                }}
                trigger={trigger}
            />
        ),
        online: (
            <AddMealPlanOnlineStep
                control={control}
                errors={errors}
                onBack={handleBack}
                onContinue={() => {
                    void handleAdvanceStep()
                }}
                trigger={trigger}
            />
        ),
        magazine: (
            <AddMealPlanMagazineStep
                control={control}
                errors={errors}
                onBack={handleBack}
                onContinue={() => {
                    void handleAdvanceStep()
                }}
                trigger={trigger}
            />
        ),
        internalRecipe: (
            <AddMealPlanInternalRecipeStep
                control={control}
                errors={errors}
                onBack={handleBack}
                searchRecipes={searchInternalRecipes}
                setValue={setValue}
                onContinue={() => {
                    void handleAdvanceStep()
                }}
                trigger={trigger}
            />
        ),
        durations: (
            <AddMealPlanDurationsStep
                control={control}
                errors={errors}
                onBack={handleBack}
                onContinue={() => {
                    void handleAdvanceStep()
                }}
                trigger={trigger}
            />
        ),
    }

    return stepComponents[currentStep]
}
