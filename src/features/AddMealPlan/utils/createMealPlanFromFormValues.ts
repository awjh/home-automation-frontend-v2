import { Course, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import MealPlan from '@defs/MealPlan'
import AddMealPlanFormValues from '../AddMealPlanForm/defs/AddMealPlanFormValues'

function parseNumberField(value: string, fieldName: string) {
    const parsedValue = Number.parseInt(value, 10)

    if (Number.isNaN(parsedValue)) {
        throw new Error(`Invalid ${fieldName}`)
    }

    return parsedValue
}

export default function createMealPlanFromFormValues(
    date: string,
    values: AddMealPlanFormValues,
): MealPlan {
    if (!values.mealTime) {
        throw new Error('Meal time is required')
    }

    if (!values.source) {
        throw new Error('Meal source is required')
    }

    const trimmedTitle = values.title.trim()
    const trimmedAuthor = values.author.trim()

    switch (values.source) {
        case SourceType.BOOK:
            return {
                author: trimmedAuthor,
                course: Course.MAIN,
                date,
                mealTime: values.mealTime,
                source: {
                    type: SourceType.BOOK,
                    title: values.bookTitle.trim(),
                    page: parseNumberField(values.pageNumber, 'page number'),
                    ...(values.series.trim() ? { series: values.series.trim() } : {}),
                },
                title: trimmedTitle,
                duration: {
                    prepDuration: parseNumberField(values.prepDuration, 'preparation time'),
                    cookingDuration: parseNumberField(values.cookingDuration, 'cooking time'),
                    standingTime: parseNumberField(values.standingTime, 'standing time'),
                },
            }
        case SourceType.ONLINE:
            return {
                author: trimmedAuthor,
                course: Course.MAIN,
                date,
                mealTime: values.mealTime,
                source: {
                    type: SourceType.ONLINE,
                    url: values.recipeUrl.trim(),
                },
                title: trimmedTitle,
                duration: {
                    prepDuration: parseNumberField(values.prepDuration, 'preparation time'),
                    cookingDuration: parseNumberField(values.cookingDuration, 'cooking time'),
                    standingTime: parseNumberField(values.standingTime, 'standing time'),
                },
            }
        case SourceType.MAGAZINE:
            return {
                author: trimmedAuthor,
                course: Course.MAIN,
                date,
                mealTime: values.mealTime,
                source: {
                    type: SourceType.MAGAZINE,
                    title: values.magazineName.trim(),
                    issue: values.magazineIssue.trim(),
                    page: parseNumberField(values.magazinePage, 'magazine page'),
                },
                title: trimmedTitle,
                duration: {
                    prepDuration: parseNumberField(values.prepDuration, 'preparation time'),
                    cookingDuration: parseNumberField(values.cookingDuration, 'cooking time'),
                    standingTime: parseNumberField(values.standingTime, 'standing time'),
                },
            }
        case SourceType.INTERNAL_RECIPE:
            return {
                author: trimmedAuthor,
                course: Course.MAIN,
                date,
                mealTime: values.mealTime,
                source: {
                    type: SourceType.INTERNAL_RECIPE,
                    recipeId: values.internalRecipeId.trim(),
                },
                title: trimmedTitle,
                duration: {
                    prepDuration: parseNumberField(values.prepDuration, 'preparation time'),
                    cookingDuration: parseNumberField(values.cookingDuration, 'cooking time'),
                    standingTime: parseNumberField(values.standingTime, 'standing time'),
                },
            }
        case SourceType.FREEZER:
            return {
                author: trimmedAuthor || 'Freezer',
                course: Course.MAIN,
                date,
                mealTime: values.mealTime,
                source: {
                    type: SourceType.FREEZER,
                },
                title: trimmedTitle,
                duration: {
                    prepDuration: parseNumberField(values.prepDuration, 'preparation time'),
                    cookingDuration: parseNumberField(values.cookingDuration, 'cooking time'),
                    standingTime: parseNumberField(values.standingTime, 'standing time'),
                },
            }
        case SourceType.READY_PREPARED:
            return {
                author: trimmedAuthor,
                course: Course.MAIN,
                date,
                mealTime: values.mealTime,
                source: {
                    type: SourceType.READY_PREPARED,
                },
                title: trimmedTitle,
                duration: {
                    prepDuration: parseNumberField(values.prepDuration, 'preparation time'),
                    cookingDuration: parseNumberField(values.cookingDuration, 'cooking time'),
                    standingTime: parseNumberField(values.standingTime, 'standing time'),
                },
            }
        case SourceType.LEFTOVERS:
            if (!values.fromDate?.trim()) {
                throw new Error('Original meal date is required for leftovers meal plans')
            }

            return {
                author: trimmedAuthor,
                course: Course.MAIN,
                date,
                mealTime: values.mealTime,
                source: {
                    type: SourceType.LEFTOVERS,
                    fromDate: values.fromDate.trim(),
                },
                title: trimmedTitle,
                duration: {
                    prepDuration: parseNumberField(values.prepDuration, 'preparation time'),
                    cookingDuration: parseNumberField(values.cookingDuration, 'cooking time'),
                    standingTime: parseNumberField(values.standingTime, 'standing time'),
                },
            }
    }
}
