import { Field, Textarea } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

type TextAreaInputProps = {
    required: boolean
    label?: string
    errorMessage?: string
    reserveErrorSpace?: boolean
} & Omit<ComponentPropsWithoutRef<typeof Textarea>, 'children' | 'required'>

export default forwardRef<HTMLTextAreaElement, TextAreaInputProps>(function TextAreaInput(
    { label, required, errorMessage, reserveErrorSpace = false, ...textAreaProps },
    ref,
) {
    const { keyColors } = useColorMode()

    return (
        <Field.Root required={required} invalid={!!errorMessage}>
            {label && (
                <Field.Label color={keyColors.primary} textTransform={'capitalize'}>
                    {label}
                    {required ? <Field.RequiredIndicator /> : null}
                </Field.Label>
            )}
            <Textarea
                ref={ref}
                borderColor={keyColors.primary}
                borderWidth={2}
                borderRadius={0}
                color={keyColors.primary}
                pl={4}
                minH={'28'}
                resize={'vertical'}
                {...textAreaProps}
            />
            {(reserveErrorSpace || errorMessage) && (
                <Field.ErrorText visibility={errorMessage ? 'visible' : 'hidden'} minH={'5'}>
                    {errorMessage ?? ' '}
                </Field.ErrorText>
            )}
        </Field.Root>
    )
})
