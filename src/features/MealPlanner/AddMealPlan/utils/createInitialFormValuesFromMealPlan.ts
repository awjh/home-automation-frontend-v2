import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '../AddMealPlanForm/defs/AddMealPlanFormValues'

const emptyFormValues: AddMealPlanFormValues = {
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
}

export function getEmptyAddMealPlanFormValues(): AddMealPlanFormValues {
    return { ...emptyFormValues }
}

export default function createInitialFormValuesFromMealPlan(
    mealPlan: MealPlan,
): AddMealPlanFormValues {
    const baseValues: AddMealPlanFormValues = {
        ...getEmptyAddMealPlanFormValues(),
        mealTime: mealPlan.mealTime,
        source: mealPlan.source.type,
        title: mealPlan.title,
        author: mealPlan.source.type === 'freezer' ? '' : mealPlan.author,
        prepDuration: mealPlan.duration.prepDuration.toString(),
        cookingDuration: mealPlan.duration.cookingDuration.toString(),
        standingTime: mealPlan.duration.standingTime.toString(),
    }

    switch (mealPlan.source.type) {
        case 'book':
            return {
                ...baseValues,
                bookTitle: mealPlan.source.title,
                pageNumber: mealPlan.source.page.toString(),
                series: mealPlan.source.series ?? '',
            }
        case 'online':
            return {
                ...baseValues,
                recipeUrl: mealPlan.source.url,
            }
        case 'magazine':
            return {
                ...baseValues,
                magazineName: mealPlan.source.title,
                magazineIssue: mealPlan.source.issue,
                magazinePage: mealPlan.source.page.toString(),
            }
        case 'internal_recipe':
            return {
                ...baseValues,
                internalRecipeId: mealPlan.source.recipeId,
            }
        case 'leftovers':
            return {
                ...baseValues,
                fromDate: mealPlan.source.fromDate,
            }
        case 'freezer':
        case 'ready_prepared':
            return baseValues
    }
}
