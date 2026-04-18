import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import { Control, FieldErrors, UseFormTrigger } from 'react-hook-form'

export default interface AddMealPlanBaseProps {
    control: Control<AddMealPlanFormValues>
    errors: FieldErrors<AddMealPlanFormValues>
    isMealTimeEditable?: boolean
    onBack: () => void
    onContinue?: () => void
    trigger?: UseFormTrigger<AddMealPlanFormValues>
}
