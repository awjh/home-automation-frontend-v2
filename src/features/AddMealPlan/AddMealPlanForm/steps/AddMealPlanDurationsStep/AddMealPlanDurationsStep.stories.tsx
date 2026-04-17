import { Flex, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import AddMealPlanDurationsStep from './AddMealPlanDurationsStep'
import AddMealPlanFormValues from '@features/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'

const submitDurationsStep = fn()

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
                    void handleSubmit((values) => submitDurationsStep(values))()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <AddMealPlanDurationsStep control={control} errors={errors} onBack={onBack} />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanDurationsStep> = {
    title: 'Features/AddMealPlan/AddMealPlanForm/Steps/AddMealPlanDurationsStep',
    component: AddMealPlanDurationsStep,
    render: (args) => <StoryWrapper {...args} />,
    args: {
        onBack: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanDurationsStep>

export const Default: Story = {}

export const WithValues: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            defaultValues={{
                prepDuration: '20',
                cookingDuration: '45',
                standingTime: '10',
            }}
        />
    ),
    play: async ({ canvas, userEvent }) => {
        submitDurationsStep.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(submitDurationsStep).toHaveBeenCalledWith({
                mealTime: '',
                source: '',
                bookTitle: '',
                pageNumber: '',
                series: '',
                recipeUrl: '',
                magazineName: '',
                magazineIssue: '',
                magazinePage: '',
                internalRecipeId: '',
                prepDuration: '20',
                cookingDuration: '45',
                standingTime: '10',
            })
        })
    },
}

export const RequiresAllDurations: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(canvas.getByText(/preparation time is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/cooking time is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/standing time is required/i)).toBeInTheDocument()
        })
    },
}
