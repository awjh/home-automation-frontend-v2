import { Flex, VStack } from '@chakra-ui/react'
import { AddMealPlanFormValues } from '@organisms/AddMealPlan/AddMealPlan.types'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import AddMealPlanOnlineStep from './AddMealPlanOnlineStep'

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
                    void handleSubmit(() => undefined)()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <AddMealPlanOnlineStep control={control} errors={errors} onBack={onBack} />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanOnlineStep> = {
    title: 'Molecules/AddMealPlanOnlineStep',
    component: AddMealPlanOnlineStep,
    render: (args) => <StoryWrapper {...args} />,
    args: {
        onBack: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanOnlineStep>

export const Default: Story = {}

export const WithValue: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            defaultValues={{
                recipeUrl: 'https://example.com/recipe/spaghetti-bolognese',
            }}
        />
    ),
}

export const RequiresValidUrl: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByText(/recipe url is required/i)).toBeInTheDocument()
        })
    },
}
