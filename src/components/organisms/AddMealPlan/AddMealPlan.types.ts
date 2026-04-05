import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

export interface AddMealPlanFormValues {
    mealTime: MealTime | ''
    source: SourceType | ''
    title: string
    author: string
    bookTitle: string
    pageNumber: string
    series: string
    recipeUrl: string
    magazineName: string
    magazineIssue: string
    magazinePage: string
    internalRecipeId: string
    prepDuration: string
    cookingDuration: string
    standingTime: string
}

export interface RecipeDurationValues {
    prepDuration: number
    cookingDuration: number
    standingTime: number
}

export interface SelectItem {
    label: string
    value: string
}

export interface InternalRecipeSearchResult {
    id: string
    title: string
    author: string
    duration: RecipeDurationValues
}

export interface InternalRecipeSearchParams {
    title: string
    author: string
}

export type SearchInternalRecipes = (
    params: InternalRecipeSearchParams,
) => Promise<InternalRecipeSearchResult[]>

export type AddMealPlanStep =
    | 'primary'
    | 'details'
    | 'book'
    | 'online'
    | 'magazine'
    | 'internalRecipe'
    | 'durations'
