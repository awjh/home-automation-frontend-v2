import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { HStack } from '@chakra-ui/react'
import { AddMealPlanFormValues } from '@organisms/AddMealPlan/AddMealPlan.types'
import { Control, Controller, FieldErrors, UseFormTrigger } from 'react-hook-form'

interface AddMealPlanOnlineStepProps {
    control: Control<AddMealPlanFormValues>
    errors: FieldErrors<AddMealPlanFormValues>
    onBack: () => void
    onContinue?: () => void
    trigger?: UseFormTrigger<AddMealPlanFormValues>
}

function isValidRecipeUrl(value: string) {
    try {
        const url = new URL(value)

        return (
            url.protocol === 'http:' ||
            url.protocol === 'https:' ||
            'Please enter a valid recipe URL'
        )
    } catch {
        return 'Please enter a valid recipe URL'
    }
}

export default function AddMealPlanOnlineStep({
    control,
    errors,
    onBack,
    onContinue,
    trigger,
}: AddMealPlanOnlineStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['recipeUrl'])

        if (isValid) {
            onContinue()
        }
    }

    return (
        <>
            <Controller
                name="recipeUrl"
                control={control}
                rules={{
                    required: 'Recipe URL is required',
                    validate: isValidRecipeUrl,
                }}
                render={({ field }) => (
                    <TextInput
                        type={'url'}
                        label={'Recipe URL'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.recipeUrl?.message}
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
