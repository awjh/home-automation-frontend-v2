import { Field, Input } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { forwardRef, type ComponentPropsWithoutRef, type HTMLInputTypeAttribute } from 'react'

type TextInputProps = {
    required: boolean
    type: Omit<HTMLInputTypeAttribute, 'password'>
    label?: string
    errorMessage?: string
    reserveErrorSpace?: boolean
} & Omit<ComponentPropsWithoutRef<typeof Input>, 'children' | 'required' | 'type'>

export default forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    { type, label, required, errorMessage, reserveErrorSpace = false, ...inputProps },
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
            <Input
                ref={ref}
                type={type as string}
                borderColor={keyColors.primary}
                borderWidth={2}
                borderRadius={0}
                color={keyColors.primary}
                pl={4}
                {...inputProps}
            />
            {(reserveErrorSpace || errorMessage) && (
                <Field.ErrorText visibility={errorMessage ? 'visible' : 'hidden'} minH={'5'}>
                    {errorMessage ?? ' '}
                </Field.ErrorText>
            )}
        </Field.Root>
    )
})
