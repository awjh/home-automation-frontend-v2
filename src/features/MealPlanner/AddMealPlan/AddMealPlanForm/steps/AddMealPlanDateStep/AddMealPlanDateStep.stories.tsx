import { Flex, VStack } from '@chakra-ui/react'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import AddMealPlanDateStep from './AddMealPlanDateStep'

const submitDateStep = fn()

interface StoryWrapperProps {
    onBack?: () => void
    defaultValues?: Partial<AddMealPlanFormValues>
}

function StoryWrapper({ onBack = fn(), defaultValues }: StoryWrapperProps) {
    const {
        control,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<AddMealPlanFormValues>({
        defaultValues: {
            mealDate: '',
            mealTime: '',
            source: '',
            course: '',
            useForLeftovers: false,
            leftoversDate: '',
            title: '',
            author: '',
            fromDate: '',
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
                    void handleSubmit((values) => submitDateStep(values))()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <AddMealPlanDateStep
                        control={control}
                        errors={errors}
                        onBack={onBack}
                        trigger={trigger}
                    />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanDateStep> = {
    title: 'Features/MealPlanner/AddMealPlan/AddMealPlanForm/Steps/AddMealPlanDateStep',
    component: AddMealPlanDateStep,
    render: (args) => <StoryWrapper {...args} />,
    args: {
        onBack: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanDateStep>

export const Default: Story = {}

export const WithValue: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            defaultValues={{
                mealDate: '2026-04-02',
            }}
        />
    ),
    play: async ({ canvas, userEvent }) => {
        submitDateStep.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(submitDateStep).toHaveBeenCalledWith({
                mealDate: '2026-04-02',
                mealTime: '',
                source: '',
                course: '',
                useForLeftovers: false,
                leftoversDate: '',
                title: '',
                author: '',
                fromDate: '',
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

export const RequiresMealDate: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(canvas.getByText(/meal date is required/i)).toBeInTheDocument()
        })
    },
}
