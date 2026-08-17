import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '../AddMealPlanForm/defs/AddMealPlanFormValues'

const emptyFormValues: AddMealPlanFormValues = {
    mealDate: '',
    mealTime: '',
    course: '',
    source: '',
    useForLeftovers: false,
    leftoversDate: '',
    title: '',
    author: '',
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
    internalRecipeId: '',
    prepDuration: '',
    cookingDuration: '',
    standingTime: '',
}

export function getEmptyAddMealPlanFormValues(): AddMealPlanFormValues {
    return { ...emptyFormValues }
}

export function createInitialLeftoversFormValuesFromMealPlan(
    mealPlan: MealPlan,
    leftoversDate: string,
): AddMealPlanFormValues {
    return {
        ...getEmptyAddMealPlanFormValues(),
        mealDate: leftoversDate,
        mealTime: mealPlan.mealTime,
        course: mealPlan.course,
        source: SourceType.LEFTOVERS,
        title: mealPlan.title,
        author: mealPlan.author,
        fromDate: mealPlan.date,
        fromMealTime: mealPlan.mealTime,
        fromCourse: mealPlan.course,
        prepDuration: mealPlan.duration.prepDuration.toString(),
        cookingDuration: mealPlan.duration.cookingDuration.toString(),
        standingTime: mealPlan.duration.standingTime.toString(),
    }
}

export default function createInitialFormValuesFromMealPlan(
    mealPlan: MealPlan,
): AddMealPlanFormValues {
    const baseValues: AddMealPlanFormValues = {
        ...getEmptyAddMealPlanFormValues(),
        mealTime: mealPlan.mealTime,
        course: mealPlan.course,
        mealDate: mealPlan.date,
        source: mealPlan.source.type,
        title: mealPlan.title,
        author: mealPlan.source.type === SourceType.FREEZER ? '' : mealPlan.author,
        prepDuration: mealPlan.duration.prepDuration.toString(),
        cookingDuration: mealPlan.duration.cookingDuration.toString(),
        standingTime: mealPlan.duration.standingTime.toString(),
    }

    switch (mealPlan.source.type) {
        case SourceType.BOOK:
            return {
                ...baseValues,
                bookTitle: mealPlan.source.title,
                pageNumber: mealPlan.source.page.toString(),
                series: mealPlan.source.series ?? '',
            }
        case SourceType.ONLINE:
            return {
                ...baseValues,
                recipeUrl: mealPlan.source.url,
            }
        case SourceType.MAGAZINE:
            return {
                ...baseValues,
                magazineName: mealPlan.source.title,
                magazineIssue: mealPlan.source.issue,
                magazinePage: mealPlan.source.page.toString(),
            }
        case SourceType.INTERNAL_RECIPE:
            return {
                ...baseValues,
                internalRecipeId: mealPlan.source.recipeId,
            }
        case SourceType.LEFTOVERS:
            return {
                ...baseValues,
                fromDate: mealPlan.source.fromDate,
                fromMealTime: mealPlan.source.fromMealTime,
                fromCourse: mealPlan.source.fromCourse,
            }
        case SourceType.FREEZER:
        case SourceType.READY_PREPARED:
            return baseValues
    }
}
