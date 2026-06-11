import TextInput from '@atoms/TextInput/TextInput'
import { GridItem } from '@chakra-ui/react'
import { type KeyboardEvent } from 'react'
import { Controller, type Control } from 'react-hook-form'
import {
    type IngredientFieldPath,
    type IngredientsFormIngredientsRow,
    type IngredientsFormValues,
} from './IngredientsSectionForm'

interface IngredientFieldProps {
    control: Control<IngredientsFormValues>
    fieldPath: IngredientFieldPath
    fieldName: keyof IngredientsFormIngredientsRow
    required: boolean
    isDraftRow: boolean
    onDraftRowEnter: (event: KeyboardEvent<HTMLInputElement>) => void
    colSpan?: number
}

export default function IngredientField({
    control,
    fieldPath,
    fieldName,
    required,
    isDraftRow,
    onDraftRowEnter,
    colSpan = 1,
}: IngredientFieldProps) {
    return (
        <GridItem colSpan={colSpan}>
            <Controller
                name={fieldPath}
                control={control}
                rules={
                    required
                        ? {
                              validate: (value: string | undefined) =>
                                  (value && value?.trim().length > 0) || `${fieldName} is required`,
                          }
                        : undefined
                }
                render={({ field, fieldState }) => (
                    <TextInput
                        type={'text'}
                        required={required}
                        errorMessage={fieldState.error?.message}
                        reserveErrorSpace={true}
                        {...field}
                        onKeyDown={(event) => {
                            if (event.key !== 'Enter') {
                                return
                            }

                            if (!isDraftRow) {
                                event.preventDefault()
                                return
                            }

                            onDraftRowEnter(event)
                        }}
                    />
                )}
            />
        </GridItem>
    )
}
