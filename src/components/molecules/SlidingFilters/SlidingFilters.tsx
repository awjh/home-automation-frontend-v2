import RangeSliderInput from '@atoms/RangeSliderInput/RangeSliderInput'
import { VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

type MinMaxRange = {
    min: number
    max: number
}

type Filters = {
    [s: string]: MinMaxRange | Filters
}

type SlidingFiltersFormValues = {
    [s: string]: MinMaxRange
}

function flattenRecipeFilters(
    filters: Filters,
    prefix = '',
): { [s: string]: MinMaxRange & { step: number } } {
    return Object.entries(filters).reduce<{ [s: string]: MinMaxRange & { step: number } }>(
        (acc, [key, value]) => {
            const path = prefix ? `${prefix}.${key}` : key

            if ('min' in value && 'max' in value) {
                acc[path] = {
                    min: value.min as number,
                    max: value.max as number,
                    step: getStepsForBounds(value as MinMaxRange),
                }
            } else {
                Object.assign(acc, flattenRecipeFilters(value, path))
            }

            return acc
        },
        {},
    )
}

function getStepsForBounds(range: MinMaxRange): number {
    return range.max - range.min > 1000 ? 5 : 1
}

export interface SlidingFiltersProps<T extends Filters> {
    filters: T
}

export default function SlidingFilters<T extends Filters>(props: SlidingFiltersProps<T>) {
    const filters = useMemo(() => flattenRecipeFilters(props.filters), [props.filters])

    const { control } = useFormContext<SlidingFiltersFormValues>()

    return (
        <VStack gap={4}>
            {Object.entries(filters).map(([key, value]) => (
                <Controller
                    key={key}
                    name={key}
                    control={control}
                    defaultValue={{ min: value.min, max: value.max }}
                    render={({ field }) => (
                        <RangeSliderInput
                            label={key.split('.').pop() ?? key}
                            min={value.min}
                            max={value.max}
                            step={value.step}
                            value={field.value ?? { min: value.min, max: value.max }}
                            onChange={field.onChange}
                        />
                    )}
                />
            ))}
        </VStack>
    )
}
