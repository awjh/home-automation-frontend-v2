import StepMap from './StepMap'
import TitleAuthorRules from './TitleAuthorRules'

interface FlowRuleOverrides {
    stepMap?: StepMap
    titleAuthor?: Partial<TitleAuthorRules>
}

export default FlowRuleOverrides
