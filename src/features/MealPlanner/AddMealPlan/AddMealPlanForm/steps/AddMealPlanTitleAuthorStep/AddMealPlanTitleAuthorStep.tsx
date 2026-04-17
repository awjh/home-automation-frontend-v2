import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { HStack } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import AddMealPlanBaseProps from '../defs/AddMealPlanBaseProps'

export type AddMealPlanTitleAuthorStepProps = AddMealPlanBaseProps & {
    authorLabel?: string
    showAuthor?: boolean
}

export default function AddMealPlanTitleAuthorStep({
    control,
    errors,
    onBack,
    authorLabel = 'Author',
    showAuthor = true,
    onContinue,
    trigger,
}: AddMealPlanTitleAuthorStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(showAuthor ? ['title', 'author'] : ['title'])

        if (isValid) {
            onContinue()
        }
    }

    return (
        <>
            <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                    <TextInput
                        type={'text'}
                        label={'Title'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.title?.message}
                    />
                )}
            />
            {showAuthor && (
                <Controller
                    name="author"
                    control={control}
                    rules={{ required: `${authorLabel} is required` }}
                    render={({ field }) => (
                        <TextInput
                            type={'text'}
                            label={authorLabel}
                            required
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            onBlur={field.onBlur}
                            errorMessage={errors.author?.message}
                        />
                    )}
                />
            )}
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
