import TextAreaInput from '@atoms/TextAreaInput/TextAreaInput'
import { GridItem } from '@chakra-ui/react'
import { type KeyboardEvent } from 'react'
import { Controller, type Control } from 'react-hook-form'
import { type MethodFieldPath, type MethodFormValues } from '../MethodForm'

interface MethodFieldProps {
    control?: Control<MethodFormValues>
    fieldPath?: MethodFieldPath
    fieldName: string
    required: boolean
    isDraftRow: boolean
    disabled?: boolean
    onDraftRowEnter: (event: KeyboardEvent<HTMLTextAreaElement>) => void
    colSpan?: number
    value?: string
    errorMessage?: string
    onValueChange?: (value: string) => void
}

export default function MethodField({
    control,
    fieldPath,
    fieldName,
    required,
    isDraftRow,
    disabled = false,
    onDraftRowEnter,
    colSpan = 1,
    value,
    errorMessage,
    onValueChange,
}: MethodFieldProps) {
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== 'Enter') {
            return
        }

        event.preventDefault()

        if (!isDraftRow) {
            return
        }

        onDraftRowEnter(event)
    }

    const input =
        control && fieldPath ? (
            <Controller
                name={fieldPath}
                control={control}
                rules={
                    required
                        ? {
                              validate: (inputValue: string | undefined) =>
                                  (inputValue && inputValue.trim().length > 0) ||
                                  `${fieldName} is required`,
                          }
                        : undefined
                }
                render={({ field, fieldState }) => (
                    <TextAreaInput
                        required={required}
                        disabled={disabled ? true : undefined}
                        errorMessage={fieldState.error?.message}
                        reserveErrorSpace={true}
                        {...field}
                        onKeyDown={handleKeyDown}
                    />
                )}
            />
        ) : (
            <TextAreaInput
                required={required}
                disabled={disabled ? true : undefined}
                errorMessage={errorMessage}
                reserveErrorSpace={true}
                value={value ?? ''}
                onChange={(event) => {
                    onValueChange?.(event.target.value)
                }}
                onKeyDown={handleKeyDown}
            />
        )

    return (
        <GridItem colSpan={colSpan} w={'full'}>
            {input}
        </GridItem>
    )
}
