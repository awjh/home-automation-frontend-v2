import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Flex, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import AddMealPlanPrimaryStep from './AddMealPlanPrimaryStep'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'

const mealTimeItems = Object.values(MealTime).map((mealTime) => ({
    label: mealTime.replaceAll('_', ' '),
    value: mealTime,
}))

const sourceItems = Object.values(SourceType).map((sourceType) => ({
    label: sourceType.replaceAll('_', ' '),
    value: sourceType,
}))

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
                    <AddMealPlanPrimaryStep
                        control={control}
                        errors={errors}
                        mealTimeItems={mealTimeItems}
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

export const RequiresPrimaryFields: Story = {
    play: async ({ canvas, userEvent }) => {
        const submitButton = canvas.getByRole('button', { name: /next/i })

        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(canvas.getByText(/meal time is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/source is required/i)).toBeInTheDocument()
        })
    },
}
