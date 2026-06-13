import TextInput from '@atoms/TextInput/TextInput'
import { GridItem } from '@chakra-ui/react'
import { type KeyboardEvent } from 'react'
import { Controller, type Control } from 'react-hook-form'
import {
    type IngredientFieldPath,
    type IngredientsFormIngredientsRow,
    type IngredientsFormValues,
} from '../IngredientsSectionForm/IngredientsSectionForm'

interface IngredientFieldProps {
    control?: Control<IngredientsFormValues>
    fieldPath?: IngredientFieldPath
    fieldName: keyof IngredientsFormIngredientsRow
    required: boolean
    isDraftRow: boolean
    disabled?: boolean
    onDraftRowEnter: (event: KeyboardEvent<HTMLInputElement>) => void
    colSpan?: number
    value?: string
    errorMessage?: string
    onValueChange?: (value: string) => void
}

export default function IngredientField({
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
}: IngredientFieldProps) {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return
        }

        if (!isDraftRow) {
            event.preventDefault()
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
                                  (inputValue && inputValue?.trim().length > 0) ||
                                  `${fieldName} is required`,
                          }
                        : undefined
                }
                render={({ field, fieldState }) => (
                    <TextInput
                        type={'text'}
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
            <TextInput
                type={'text'}
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

    return <GridItem colSpan={colSpan}>{input}</GridItem>
}
