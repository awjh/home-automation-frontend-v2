import AddMealPlanStep from '../flows/defs/AddMealPlanStep'
import AddMealPlanBookStep, {
    AddMealPlanBookStepProps,
} from './AddMealPlanBookStep/AddMealPlanBookStep'
import AddMealPlanDurationsStep, {
    AddMealPlanDurationsStepProps,
} from './AddMealPlanDurationsStep/AddMealPlanDurationsStep'
import AddMealPlanInternalRecipeStep, {
    AddMealPlanInternalRecipeStepProps,
} from './AddMealPlanInternalRecipeStep/AddMealPlanInternalRecipeStep'
import AddMealPlanLeftoversStep, {
    AddMealPlanLeftoversStepProps,
} from './AddMealPlanLeftoversStep/AddMealPlanLeftoversStep'
import AddMealPlanMagazineStep, {
    AddMealPlanMagazineStepProps,
} from './AddMealPlanMagazineStep/AddMealPlanMagazineStep'
import AddMealPlanOnlineStep, {
    AddMealPlanOnlineStepProps,
} from './AddMealPlanOnlineStep/AddMealPlanOnlineStep'
import AddMealPlanPrimaryStep, {
    AddMealPlanPrimaryStepProps,
} from './AddMealPlanPrimaryStep/AddMealPlanPrimaryStep'
import AddMealPlanTitleAuthorStep, {
    AddMealPlanTitleAuthorStepProps,
} from './AddMealPlanTitleAuthorStep/AddMealPlanTitleAuthorStep'

type StepComponentProps = AddMealPlanBookStepProps &
    AddMealPlanPrimaryStepProps &
    AddMealPlanDurationsStepProps &
    AddMealPlanInternalRecipeStepProps &
    AddMealPlanLeftoversStepProps &
    AddMealPlanMagazineStepProps &
    AddMealPlanOnlineStepProps &
    AddMealPlanTitleAuthorStepProps & {
        step: AddMealPlanStep
    }

export default function AddMealPlanStepComponent(props: StepComponentProps) {
    const { step } = props

    switch (step) {
        case 'primary':
            return <AddMealPlanPrimaryStep {...props} />
        case 'book':
            return <AddMealPlanBookStep {...props} />
        case 'details':
            return <AddMealPlanTitleAuthorStep {...props} />
        case 'durations':
            return <AddMealPlanDurationsStep {...props} />
        case 'internalRecipe':
            return <AddMealPlanInternalRecipeStep {...props} />
        case 'leftovers':
            return <AddMealPlanLeftoversStep {...props} />
        case 'magazine':
            return <AddMealPlanMagazineStep {...props} />
        case 'online':
            return <AddMealPlanOnlineStep {...props} />
    }

    throw new Error(`Unsupported step: ${step}`)
}
