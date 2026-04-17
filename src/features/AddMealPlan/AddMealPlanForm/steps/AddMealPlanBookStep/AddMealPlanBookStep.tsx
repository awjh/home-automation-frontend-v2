import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { HStack } from '@chakra-ui/react'
import AddMealPlanBaseProps from '@features/AddMealPlan/AddMealPlanForm/steps/defs/AddMealPlanBaseProps'
import { Controller } from 'react-hook-form'

export type AddMealPlanBookStepProps = AddMealPlanBaseProps

export default function AddMealPlanBookStep({
    control,
    errors,
    onBack,
    onContinue,
    trigger,
}: AddMealPlanBookStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['bookTitle', 'pageNumber'])

        if (isValid) {
            onContinue()
        }
    }

    return (
        <>
            <Controller
                name="bookTitle"
                control={control}
                rules={{ required: 'Book title is required' }}
                render={({ field }) => (
                    <TextInput
                        type={'text'}
                        label={'Book title'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.bookTitle?.message}
                    />
                )}
            />
            <Controller
                name="pageNumber"
                control={control}
                rules={{
                    required: 'Page number is required',
                    validate: (value) =>
                        (/^\d+$/.test(value) && Number(value) > 0) ||
                        'Page number must be a positive number',
                }}
                render={({ field }) => (
                    <TextInput
                        type={'number'}
                        label={'Page number'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.pageNumber?.message}
                    />
                )}
            />
            <Controller
                name="series"
                control={control}
                render={({ field }) => (
                    <TextInput
                        type={'text'}
                        label={'Series'}
                        required={false}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.series?.message}
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
