import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

interface AddMealPlanFormValues {
    mealTime: MealTime | ''
    source: SourceType | ''
    title: string
    author: string
    fromDate: string
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

export default AddMealPlanFormValues
