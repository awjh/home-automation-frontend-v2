import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { HStack } from '@chakra-ui/react'
import { AddMealPlanFormValues } from '@organisms/AddMealPlan/AddMealPlan.types'
import { Control, Controller, FieldErrors, UseFormTrigger } from 'react-hook-form'

interface AddMealPlanDurationsStepProps {
    control: Control<AddMealPlanFormValues>
    errors: FieldErrors<AddMealPlanFormValues>
    onBack: () => void
    onContinue?: () => void
    trigger?: UseFormTrigger<AddMealPlanFormValues>
}

const durationValidationMessage = 'Duration must be 0 or more minutes'

function isValidMinutes(value: string) {
    return (/^\d+$/.test(value) && Number(value) >= 0) || durationValidationMessage
}

export default function AddMealPlanDurationsStep({
    control,
    errors,
    onBack,
    onContinue,
    trigger,
}: AddMealPlanDurationsStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['prepDuration', 'cookingDuration', 'standingTime'])

        if (isValid) {
            onContinue()
        }
    }

    return (
        <>
            <Controller
                name="prepDuration"
                control={control}
                rules={{
                    required: 'Preparation time is required',
                    validate: isValidMinutes,
                }}
                render={({ field }) => (
                    <TextInput
                        type={'number'}
                        label={'Preparation time (minutes)'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.prepDuration?.message}
                    />
                )}
            />
            <Controller
                name="cookingDuration"
                control={control}
                rules={{
                    required: 'Cooking time is required',
                    validate: isValidMinutes,
                }}
                render={({ field }) => (
                    <TextInput
                        type={'number'}
                        label={'Cooking time (minutes)'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.cookingDuration?.message}
                    />
                )}
            />
            <Controller
                name="standingTime"
                control={control}
                rules={{
                    required: 'Standing time is required',
                    validate: isValidMinutes,
                }}
                render={({ field }) => (
                    <TextInput
                        type={'number'}
                        label={'Standing time (minutes)'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.standingTime?.message}
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
