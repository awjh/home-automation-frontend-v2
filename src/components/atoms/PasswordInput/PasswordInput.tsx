import { Field, IconButton, Input, InputGroup, useControllableState } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { LuEye, LuEyeOff } from 'react-icons/lu'

interface PasswordInputProps {
    label: string
    value?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    errorMessage?: string
}

export default function PasswordInput({
    label,
    value,
    onChange,
    onBlur,
    errorMessage,
}: PasswordInputProps) {
    const { keyColors } = useColorMode()
    const [visible, setVisible] = useControllableState({
        defaultValue: false,
    })

    return (
        <Field.Root required={true} invalid={!!errorMessage}>
            <Field.Label color={keyColors.primary}>
                {label}
                <Field.RequiredIndicator />
            </Field.Label>
            <InputGroup
                endElement={
                    <IconButton
                        tabIndex={-1}
                        me="-2"
                        aspectRatio="square"
                        size="sm"
                        variant="ghost"
                        height="calc(100% - {spacing.2})"
                        aria-label="Toggle password visibility"
                        color={keyColors.primary}
                        _hover={{ bg: keyColors.iconButtonHoverBg }}
                        onPointerDown={(e) => {
                            e.preventDefault()
                            setVisible(!visible)
                        }}
                    >
                        {visible ? <LuEye /> : <LuEyeOff />}
                    </IconButton>
                }
            >
                <Input
                    borderColor={keyColors.primary}
                    borderWidth={2}
                    borderRadius={0}
                    color={keyColors.primary}
                    type={visible ? 'text' : 'password'}
                    value={value ?? ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    onBlur={onBlur}
                />
            </InputGroup>
            {errorMessage && <Field.ErrorText>{errorMessage}</Field.ErrorText>}
        </Field.Root>
    )
}
