import Button from '@atoms/Button/Button'
import SelectInput, { SelectItem } from '@atoms/SelectInput/SelectInput'
import TextInput from '@atoms/TextInput/TextInput'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { HStack } from '@chakra-ui/react'
import { Controller, useWatch } from 'react-hook-form'
import AddMealPlanBaseProps from '../defs/AddMealPlanBaseProps'

export type AddMealPlanPrimaryStepProps = AddMealPlanBaseProps & {
    mealTimeItems: SelectItem[]
    sourceItems: SelectItem[]
    courseItems: SelectItem[]
    isMealTimeEditable: boolean
    isSourceEditable: boolean
    isCourseEditable: boolean
    showUseForLeftoversQuestion: boolean
}

export default function AddMealPlanPrimaryStep({
    control,
    errors,
    isMealTimeEditable,
    isSourceEditable,
    isCourseEditable,
    showUseForLeftoversQuestion,
    mealTimeItems,
    courseItems,
    sourceItems,
    onBack,
    onContinue,
    trigger,
}: AddMealPlanPrimaryStepProps) {
    const selectedSource = useWatch({ control, name: 'source' })
    const useForLeftovers = useWatch({ control, name: 'useForLeftovers' })
    const showUseForLeftovers =
        showUseForLeftoversQuestion &&
        selectedSource !== '' &&
        selectedSource !== SourceType.LEFTOVERS
    const showLeftoversEntries = showUseForLeftovers && useForLeftovers

    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(
            showLeftoversEntries
                ? ['mealTime', 'course', 'source', 'leftoversDate']
                : ['mealTime', 'course', 'source'],
        )

        if (isValid) {
            onContinue()
        }
    }

    return (
        <>
            <Controller
                name="mealTime"
                control={control}
                rules={{ required: 'Meal time is required' }}
                render={({ field }) => (
                    <SelectInput
                        label={'Meal time'}
                        options={mealTimeItems}
                        required
                        disabled={!isMealTimeEditable}
                        value={field.value}
                        onChange={(value) => field.onChange(value as MealTime)}
                        onBlur={field.onBlur}
                        errorMessage={errors.mealTime?.message}
                    />
                )}
            />
            <Controller
                name="course"
                control={control}
                rules={{ required: 'Course is required' }}
                render={({ field }) => (
                    <SelectInput
                        label={'Course'}
                        options={courseItems}
                        required
                        disabled={!isCourseEditable}
                        value={field.value}
                        onChange={(value) => field.onChange(value as Course)}
                        onBlur={field.onBlur}
                        errorMessage={errors.course?.message}
                    />
                )}
            />
            <Controller
                name="source"
                control={control}
                rules={{ required: 'Source is required' }}
                render={({ field }) => (
                    <SelectInput
                        label={'Source'}
                        options={sourceItems}
                        required
                        disabled={!isSourceEditable}
                        value={field.value}
                        onChange={(value) => field.onChange(value as SourceType)}
                        onBlur={field.onBlur}
                        errorMessage={errors.source?.message}
                    />
                )}
            />
            {showUseForLeftovers ? (
                <Controller
                    name="useForLeftovers"
                    control={control}
                    render={({ field }) => (
                        <SelectInput
                            label={'Use for leftovers?'}
                            options={[
                                { label: 'No', value: 'false' },
                                { label: 'Yes', value: 'true' },
                            ]}
                            value={field.value ? 'true' : 'false'}
                            onChange={(value) => field.onChange(value === 'true')}
                            onBlur={field.onBlur}
                        />
                    )}
                />
            ) : null}
            {showLeftoversEntries ? (
                <>
                    <Controller
                        name="leftoversDate"
                        control={control}
                        rules={{ required: 'Leftovers date is required' }}
                        render={({ field }) => (
                            <TextInput
                                type={'date'}
                                label={'When will the leftovers be used?'}
                                required
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                onBlur={field.onBlur}
                                errorMessage={errors.leftoversDate?.message}
                            />
                        )}
                    />
                </>
            ) : null}
            <HStack mt={2} w={'full'} justifyContent={'space-between'}>
                <Button type={'button'} onClick={onBack} colorStyle={'secondary'}>
                    Cancel
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
