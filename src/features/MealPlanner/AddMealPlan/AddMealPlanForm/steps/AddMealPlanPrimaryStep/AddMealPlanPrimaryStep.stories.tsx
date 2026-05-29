import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Flex, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import AddMealPlanPrimaryStep from './AddMealPlanPrimaryStep'

const submitPrimaryStep = fn()

const mealTimeItems = Object.values(MealTime).map((mealTime) => ({
    label: mealTime.replaceAll('_', ' '),
    value: mealTime,
}))

const courseItems = Object.values(SourceType).map((course) => ({
    label: course.replaceAll('_', ' '),
    value: course,
}))

const sourceItems = Object.values(SourceType).map((sourceType) => ({
    label: sourceType.replaceAll('_', ' '),
    value: sourceType,
}))

interface StoryWrapperProps {
    onBack?: () => void
    defaultValues?: Partial<AddMealPlanFormValues>
    showUseForLeftoversQuestion?: boolean
    onSubmit?: (values: AddMealPlanFormValues) => void
}

function StoryWrapper({
    onBack = fn(),
    defaultValues,
    showUseForLeftoversQuestion = true,
    onSubmit = submitPrimaryStep,
}: StoryWrapperProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddMealPlanFormValues>({
        defaultValues: {
            mealTime: '',
            course: '',
            source: '',
            useForLeftovers: false,
            leftoversDate: '',
            bookTitle: '',
            pageNumber: '',
            series: '',
            recipeUrl: '',
            magazineName: '',
            magazineIssue: '',
            magazinePage: '',
            internalRecipeId: '',
            prepDuration: '',
            cookingDuration: '',
            standingTime: '',
            ...defaultValues,
        },
        mode: 'onTouched',
    })

    return (
        <Flex p={4} maxW={'450px'}>
            <form
                noValidate
                style={{ width: '100%' }}
                onSubmit={(event) => {
                    event.preventDefault()
                    void handleSubmit((values) => onSubmit(values))()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <AddMealPlanPrimaryStep
                        control={control}
                        errors={errors}
                        isMealTimeEditable={true}
                        isCourseEditable={true}
                        isSourceEditable={true}
                        showUseForLeftoversQuestion={showUseForLeftoversQuestion}
                        mealTimeItems={mealTimeItems}
                        courseItems={courseItems}
                        sourceItems={sourceItems}
                        onBack={onBack}
                    />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanPrimaryStep> = {
    title: 'Features/MealPlanner/AddMealPlan/AddMealPlanForm/Steps/AddMealPlanPrimaryStep',
    component: AddMealPlanPrimaryStep,
    render: () => <StoryWrapper />,
}

export default meta
type Story = StoryObj<typeof meta>

export const BookSource: Story = {
    render: () => <StoryWrapper defaultValues={{ source: SourceType.BOOK }} />,
}

export const NonBookSource: Story = {
    render: () => <StoryWrapper defaultValues={{ source: SourceType.ONLINE }} />,
}

export const LeftoversSourceHidesFollowUpQuestion: Story = {
    render: () => <StoryWrapper defaultValues={{ source: SourceType.LEFTOVERS }} />,
}

export const EditModeHidesFollowUpQuestion: Story = {
    render: () => (
        <StoryWrapper
            defaultValues={{ source: SourceType.BOOK }}
            showUseForLeftoversQuestion={false}
        />
    ),
}

export const RequiresPrimaryFields: Story = {
    play: async ({ canvas, userEvent }) => {
        const submitButton = canvas.getByRole('button', { name: /next/i })

        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(canvas.getByText(/meal time is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/course is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/source is required/i)).toBeInTheDocument()
        })
    },
}

export const CanUseMealForLeftovers: Story = {
    render: () => (
        <StoryWrapper
            defaultValues={{
                mealTime: MealTime.DINNER,
                course: Course.MAIN,
                source: SourceType.ONLINE,
                useForLeftovers: false,
                leftoversDate: '',
            }}
        />
    ),
    play: async ({ canvas, userEvent }) => {
        submitPrimaryStep.mockClear()

        const leftoversSelect = canvas.getByLabelText(/use for leftovers\?/i, {
            selector: 'select',
        })

        await userEvent.selectOptions(leftoversSelect, 'true')

        const leftoversDateInput = canvas.getByLabelText(/when will the leftovers be used\?/i, {
            selector: 'input',
        })

        fireEvent.change(leftoversDateInput, { target: { value: '2026-06-02' } })

        await waitFor(() => {
            expect(leftoversDateInput).toHaveValue('2026-06-02')
        })

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(submitPrimaryStep).toHaveBeenCalledWith(
                expect.objectContaining({
                    mealTime: MealTime.DINNER,
                    course: Course.MAIN,
                    source: SourceType.ONLINE,
                    useForLeftovers: true,
                    leftoversDate: '2026-06-02',
                }),
            )
        })
    },
}
