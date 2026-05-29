import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { HStack } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import AddMealPlanBaseProps from '../defs/AddMealPlanBaseProps'

export type AddMealPlanDateStepProps = AddMealPlanBaseProps

export default function AddMealPlanDateStep({
    control,
    errors,
    onBack,
    onContinue,
    trigger,
}: AddMealPlanDateStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['mealDate'])

        if (isValid) {
            onContinue()
        }
    }

    return (
        <>
            <Controller
                name="mealDate"
                control={control}
                rules={{ required: 'Meal date is required' }}
                render={({ field }) => (
                    <TextInput
                        type={'date'}
                        label={'Meal date'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.mealDate?.message}
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
                        Submit
                    </Button>
                ) : (
                    <Button type={'submit'}>Submit</Button>
                )}
            </HStack>
        </>
    )
}
