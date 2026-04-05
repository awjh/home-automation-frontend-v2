import Button from '@atoms/Button/Button'
import SelectInput from '@atoms/SelectInput/SelectInput'
import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { HStack } from '@chakra-ui/react'
import { AddMealPlanFormValues, SelectItem } from '@organisms/AddMealPlan/AddMealPlan.types'
import { Control, Controller, FieldErrors, UseFormTrigger } from 'react-hook-form'

interface AddMealPlanPrimaryStepProps {
    control: Control<AddMealPlanFormValues>
    errors: FieldErrors<AddMealPlanFormValues>
    mealTimeItems: SelectItem[]
    sourceItems: SelectItem[]
    onCancel: () => void
    onContinue?: () => void
    trigger?: UseFormTrigger<AddMealPlanFormValues>
}

export default function AddMealPlanPrimaryStep({
    control,
    errors,
    mealTimeItems,
    sourceItems,
    onCancel,
    onContinue,
    trigger,
}: AddMealPlanPrimaryStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['mealTime', 'source'])

        if (isValid) {
            onContinue()
        }
    }

    return (
        <>
            <Controller
                name="mealTime"
                control={control}
                rules={{ required: 'Meal time is required' }}
                render={({ field }) => (
                    <SelectInput
                        label={'Meal time'}
                        options={mealTimeItems}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value as MealTime)}
                        onBlur={field.onBlur}
                        errorMessage={errors.mealTime?.message}
                    />
                )}
            />
            <Controller
                name="source"
                control={control}
                rules={{ required: 'Source is required' }}
                render={({ field }) => (
                    <SelectInput
                        label={'Source'}
                        options={sourceItems}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value as SourceType)}
                        onBlur={field.onBlur}
                        errorMessage={errors.source?.message}
                    />
                )}
            />
            <HStack mt={2} w={'full'} justifyContent={'space-between'}>
                <Button type={'button'} onClick={onCancel} colorStyle={'secondary'}>
                    Cancel
                </Button>
                {onContinue ? (
                    <Button
                        type={'button'}
                        onClick={() => {
                            void handleContinue()
                        }}
                    >
                        Next
                    </Button>
                ) : (
                    <Button type={'submit'}>Next</Button>
                )}
            </HStack>
        </>
    )
}
