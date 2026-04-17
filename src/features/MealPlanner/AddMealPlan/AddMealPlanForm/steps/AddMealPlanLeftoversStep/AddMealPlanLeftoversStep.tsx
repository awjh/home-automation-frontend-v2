import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { HStack } from '@chakra-ui/react'
import AddMealPlanBaseProps from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/steps/defs/AddMealPlanBaseProps'
import { Controller } from 'react-hook-form'

export type AddMealPlanLeftoversStepProps = AddMealPlanBaseProps

export default function AddMealPlanLeftoversStep({
    control,
    errors,
    onBack,
    onContinue,
    trigger,
}: AddMealPlanLeftoversStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['fromDate'])

        if (isValid) {
            onContinue()
        }
    }

    return (
        <>
            <Controller
                name="fromDate"
                control={control}
                rules={{ required: 'Original meal date is required' }}
                render={({ field }) => (
                    <TextInput
                        type={'date'}
                        label={'Original meal date'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.fromDate?.message}
                    />
                )}
            />
            <HStack mt={2} w={'full'} justifyContent={'space-between'}>
                <Button type={'button'} onClick={onBack} colorStyle={'secondary'}>
                    Back
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
