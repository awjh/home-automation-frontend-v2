import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { HStack } from '@chakra-ui/react'
import { AddMealPlanFormValues } from '@organisms/AddMealPlan/AddMealPlan.types'
import { Control, Controller, FieldErrors, UseFormTrigger } from 'react-hook-form'

interface AddMealPlanMagazineStepProps {
    control: Control<AddMealPlanFormValues>
    errors: FieldErrors<AddMealPlanFormValues>
    onBack: () => void
    onContinue?: () => void
    trigger?: UseFormTrigger<AddMealPlanFormValues>
}

function isValidMagazinePage(value: string) {
    return (/^\d+$/.test(value) && Number(value) > 0) || 'Page must be a positive number'
}

export default function AddMealPlanMagazineStep({
    control,
    errors,
    onBack,
    onContinue,
    trigger,
}: AddMealPlanMagazineStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['magazineName', 'magazineIssue', 'magazinePage'])

        if (isValid) {
            onContinue()
        }
    }

    return (
        <>
            <Controller
                name="magazineName"
                control={control}
                rules={{ required: 'Magazine name is required' }}
                render={({ field }) => (
                    <TextInput
                        type={'text'}
                        label={'Magazine name'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.magazineName?.message}
                    />
                )}
            />
            <Controller
                name="magazineIssue"
                control={control}
                rules={{ required: 'Issue is required' }}
                render={({ field }) => (
                    <TextInput
                        type={'text'}
                        label={'Issue'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.magazineIssue?.message}
                    />
                )}
            />
            <Controller
                name="magazinePage"
                control={control}
                rules={{
                    required: 'Page is required',
                    validate: isValidMagazinePage,
                }}
                render={({ field }) => (
                    <TextInput
                        type={'number'}
                        label={'Page'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.magazinePage?.message}
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
