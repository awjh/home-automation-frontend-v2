import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import FlowRules from './defs/FlowRules'
import BaseFlowRules from './constants/BaseFlowRules'
import EmptySourceStepMap from './constants/EmptySourceStepMap'
import SourceFlowRuleOverrides from './constants/SourceFlowRuleOverrides'
import FlowSource from '../defs/FlowSource'

export default function getFlowRules(source: SourceType | '', flowSource: FlowSource): FlowRules {
    if (source === '') {
        return {
            ...BaseFlowRules,
            stepMap: EmptySourceStepMap,
        }
    }

    const overrides = SourceFlowRuleOverrides[`${source}_${flowSource}`]

    if (!overrides) {
        return BaseFlowRules
    }

    return {
        stepMap: overrides.stepMap ?? BaseFlowRules.stepMap,
        titleAuthor: {
            ...BaseFlowRules.titleAuthor,
            ...overrides.titleAuthor,
        },
    }
}
