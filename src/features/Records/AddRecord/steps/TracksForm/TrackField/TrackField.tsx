import TextInput from '@atoms/TextInput/TextInput'
import { GridItem } from '@chakra-ui/react'
import { type KeyboardEvent } from 'react'
import { Controller, type Control } from 'react-hook-form'
import {
    validateTrackDuration,
    type TrackFieldPath,
    type TracksFormTrackRow,
    type TracksFormValues,
} from '../SideForm/SideForm'

interface TrackFieldProps {
    control?: Control<TracksFormValues>
    fieldPath?: TrackFieldPath
    fieldName: keyof TracksFormTrackRow
    isDraftRow: boolean
    onDraftRowEnter: () => void
    colSpan?: number
    value?: string
    errorMessage?: string
    onValueChange?: (value: string) => void
}

export default function TrackField({
    control,
    fieldPath,
    fieldName,
    isDraftRow,
    onDraftRowEnter,
    colSpan = 1,
    value,
    errorMessage,
    onValueChange,
}: TrackFieldProps) {
    const ariaLabel = `${isDraftRow ? 'new ' : ''}track ${fieldName}`
    const placeholder = fieldName === 'duration' ? 'mm:ss' : undefined

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return
        }

        event.preventDefault()

        if (isDraftRow) {
            onDraftRowEnter()
        }
    }

    const input =
        control && fieldPath ? (
            <Controller
                name={fieldPath}
                control={control}
                rules={{
                    validate: (inputValue: string | undefined) =>
                        fieldName === 'duration'
                            ? validateTrackDuration(inputValue)
                            : (inputValue && inputValue.trim().length > 0) ||
                              `${fieldName} is required`,
                }}
                render={({ field, fieldState }) => (
                    <TextInput
                        type={'text'}
                        required={true}
                        aria-label={ariaLabel}
                        placeholder={placeholder}
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
                required={false}
                aria-label={ariaLabel}
                placeholder={placeholder}
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
