import { Flex, VStack } from '@chakra-ui/react'
import AddMealPlanFormValues from '@features/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm } from 'react-hook-form'
import { expect, fn, waitFor } from 'storybook/test'
import AddMealPlanBookStep from './AddMealPlanBookStep'

const submitBookStep = fn()

interface StoryWrapperProps {
    onBack?: () => void
    defaultValues?: Partial<AddMealPlanFormValues>
}

function StoryWrapper({ onBack = fn(), defaultValues }: StoryWrapperProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddMealPlanFormValues>({
        defaultValues: {
            mealTime: '',
            source: '',
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
                    void handleSubmit((values) => submitBookStep(values))()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <AddMealPlanBookStep control={control} errors={errors} onBack={onBack} />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanBookStep> = {
    title: 'Features/AddMealPlan/AddMealPlanForm/Steps/AddMealPlanBookStep',
    component: AddMealPlanBookStep,
    render: (args) => <StoryWrapper {...args} />,
    args: {
        onBack: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanBookStep>

export const Default: Story = {}

export const WithValues: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            defaultValues={{
                bookTitle: 'The Roasting Tin',
                pageNumber: '86',
                series: 'Simple Suppers',
            }}
        />
    ),
    play: async ({ canvas, userEvent }) => {
        submitBookStep.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(submitBookStep).toHaveBeenCalledWith({
                mealTime: '',
                source: '',
                title: '',
                author: '',
                fromDate: '',
                bookTitle: 'The Roasting Tin',
                pageNumber: '86',
                series: 'Simple Suppers',
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

export const WithoutSeries: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            defaultValues={{
                bookTitle: 'The Roasting Tin',
                pageNumber: '86',
            }}
        />
    ),
    play: async ({ canvas, userEvent }) => {
        submitBookStep.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(submitBookStep).toHaveBeenCalledWith({
                mealTime: '',
                source: '',
                title: '',
                author: '',
                fromDate: '',
                bookTitle: 'The Roasting Tin',
                pageNumber: '86',
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

export const RequiresBookFields: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByText(/book title is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/page number is required/i)).toBeInTheDocument()
        })
    },
}
