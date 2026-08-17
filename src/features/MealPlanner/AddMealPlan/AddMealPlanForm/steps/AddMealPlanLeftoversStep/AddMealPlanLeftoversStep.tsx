import Button from '@atoms/Button/Button'
import SelectInput from '@atoms/SelectInput/SelectInput'
import TextInput from '@atoms/TextInput/TextInput'
import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import { HStack } from '@chakra-ui/react'
import AddMealPlanBaseProps from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/steps/defs/AddMealPlanBaseProps'
import { Controller } from 'react-hook-form'

export type AddMealPlanLeftoversStepProps = AddMealPlanBaseProps

export default function AddMealPlanLeftoversStep({
    control,
    errors,
    onBack,
    onContinue,
    trigger,
}: AddMealPlanLeftoversStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['fromDate', 'fromMealTime', 'fromCourse'])

        if (isValid) {
            onContinue()
        }
    }

    const mealTimeOptions = Object.values(MealTime).map((mealTime) => ({
        label: mealTime,
        value: mealTime,
    }))

    const courseOptions = Object.values(Course).map((mealCourse) => ({
        label: mealCourse,
        value: mealCourse,
    }))

    return (
        <>
            <Controller
                name="fromDate"
                control={control}
                rules={{ required: 'Original meal date is required' }}
                render={({ field }) => (
                    <TextInput
                        type={'date'}
                        label={'Original meal date'}
                        required
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        errorMessage={errors.fromDate?.message}
                    />
                )}
            />
            <Controller
                name="fromMealTime"
                control={control}
                rules={{ required: 'Original meal time is required' }}
                render={({ field }) => (
                    <SelectInput
                        label={'Original meal time'}
                        options={mealTimeOptions}
                        required
                        errorMessage={errors.fromMealTime?.message}
                        {...field}
                    />
                )}
            />
            <Controller
                name="fromCourse"
                control={control}
                rules={{ required: 'Original meal course is required' }}
                render={({ field }) => (
                    <SelectInput
                        label={'Original meal course'}
                        options={courseOptions}
                        required
                        errorMessage={errors.fromMealTime?.message}
                        {...field}
                    />
                )}
            />
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
