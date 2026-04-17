import FlowRules from '../defs/FlowRules'
import StepMap from '../defs/StepMap'

const defaultSourceStepMap: StepMap = {
    1: 'primary',
    2: 'details',
    3: 'durations',
}

const BaseFlowRules: FlowRules = {
    stepMap: defaultSourceStepMap,
    titleAuthor: {
        showAuthor: true,
        authorLabel: 'Author',
    },
}

export default BaseFlowRules
