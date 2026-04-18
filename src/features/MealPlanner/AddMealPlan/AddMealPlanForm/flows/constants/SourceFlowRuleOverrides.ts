import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import FlowRuleOverrides from '../defs/FlowRuleOverrides'

const SourceFlowRuleOverrides: Partial<Record<SourceType, FlowRuleOverrides>> = {
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
            3: 'details',
            4: 'durations',
        },
    },
    [SourceType.LEFTOVERS]: {
        stepMap: {
            1: 'primary',
            2: 'details',
            3: 'leftovers',
            4: 'durations',
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

export default SourceFlowRuleOverrides
