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

// TODO
// I want to also add support for editing
// I need to tidy up the features so that maybe they live under screens rather than being their own folder? Would a feature ever be shared, probs not?
// also some things in the atoms and molecules are only use for meal plans or logins etc, so maybe they should be moved to the meal plan feature folder
