import { Flex, VStack } from '@chakra-ui/react'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm } from 'react-hook-form'
import { expect, fn, waitFor } from 'storybook/test'
import AddMealPlanLeftoversStep from './AddMealPlanLeftoversStep'
import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'

const submitLeftoversStep = fn()

interface StoryWrapperProps {
    onBack?: () => void
    onContinue?: () => void
    defaultValues?: Partial<AddMealPlanFormValues>
}

function StoryWrapper({ onBack = fn(), onContinue, defaultValues }: StoryWrapperProps) {
    const {
        control,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<AddMealPlanFormValues>({
        defaultValues: {
            mealTime: '',
            mealDate: '2026-04-02',
            source: '',
            title: '',
            author: '',
            fromDate: '',
            fromMealTime: '',
            fromCourse: '',
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
                    void handleSubmit((values) => submitLeftoversStep(values))()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <AddMealPlanLeftoversStep
                        control={control}
                        errors={errors}
                        onContinue={onContinue}
                        onBack={onBack}
                        trigger={trigger}
                    />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanLeftoversStep> = {
    title: 'Features/MealPlanner/AddMealPlan/AddMealPlanForm/Steps/AddMealPlanLeftoversStep',
    component: AddMealPlanLeftoversStep,
    render: (args) => <StoryWrapper {...args} />,
    args: {
        onBack: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanLeftoversStep>

export const Default: Story = {}

export const WithValue: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            defaultValues={{
                fromDate: '2026-04-03',
                fromMealTime: MealTime.DINNER,
                fromCourse: Course.MAIN,
                mealDate: '2026-04-02',
            }}
        />
    ),
    play: async ({ canvas, userEvent }) => {
        submitLeftoversStep.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(submitLeftoversStep).toHaveBeenCalledWith({
                mealTime: '',
                mealDate: '2026-04-02',
                source: '',
                title: '',
                author: '',
                fromDate: '2026-04-03',
                fromMealTime: MealTime.DINNER,
                fromCourse: Course.MAIN,
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
            })
        })
    },
}

export const RequiresOriginalMealDate: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByText(/original meal date is required/i)).toBeInTheDocument()
        })
    },
}
