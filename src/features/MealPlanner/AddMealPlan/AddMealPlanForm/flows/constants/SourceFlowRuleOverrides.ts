import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import FlowRuleOverrides from '../defs/FlowRuleOverrides'
import FlowSource from '../../defs/FlowSource'

const SourceFlowRuleOverrides: Partial<Record<`${SourceType}_${FlowSource}`, FlowRuleOverrides>> = {
    [`${SourceType.BOOK}_${FlowSource.MEAL_PLANNER}`]: {
        stepMap: {
            1: 'primary',
            2: 'details',
            3: 'book',
            4: 'durations',
        },
    },
    [`${SourceType.INTERNAL_RECIPE}_${FlowSource.MEAL_PLANNER}`]: {
        stepMap: {
            1: 'primary',
            2: 'internalRecipe',
        },
    },
    [`${SourceType.INTERNAL_RECIPE}_${FlowSource.RECIPE_PAGE}`]: {
        stepMap: {
            1: 'primary',
            2: 'mealDate',
        },
    },
    [`${SourceType.MAGAZINE}_${FlowSource.MEAL_PLANNER}`]: {
        stepMap: {
            1: 'primary',
            2: 'details',
            3: 'magazine',
            4: 'durations',
        },
    },
    [`${SourceType.ONLINE}_${FlowSource.MEAL_PLANNER}`]: {
        stepMap: {
            1: 'primary',
            2: 'online',
            3: 'details',
            4: 'durations',
        },
    },
    [`${SourceType.LEFTOVERS}_${FlowSource.MEAL_PLANNER}`]: {
        stepMap: {
            1: 'primary',
            2: 'details',
            3: 'leftovers',
            4: 'durations',
        },
    },
    [`${SourceType.FREEZER}_${FlowSource.MEAL_PLANNER}`]: {
        titleAuthor: {
            showAuthor: false,
        },
    },
    [`${SourceType.READY_PREPARED}_${FlowSource.MEAL_PLANNER}`]: {
        titleAuthor: {
            authorLabel: 'Producer',
        },
    },
}

export default SourceFlowRuleOverrides
