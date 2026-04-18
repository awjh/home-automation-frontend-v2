import { Flex, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import AddMealPlanMagazineStep from './AddMealPlanMagazineStep'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'

const submitMagazineStep = fn()

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
                    void handleSubmit((values) => submitMagazineStep(values))()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <AddMealPlanMagazineStep
                        control={control}
                        errors={errors}
                        showUseForLeftoversQuestion={true}
                        onBack={onBack}
                    />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanMagazineStep> = {
    title: 'Features/MealPlanner/AddMealPlan/AddMealPlanForm/Steps/AddMealPlanMagazineStep',
    component: AddMealPlanMagazineStep,
    render: (args) => <StoryWrapper {...args} />,
    args: {
        onBack: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanMagazineStep>

export const Default: Story = {}

export const WithValues: Story = {
    play: async ({ canvas, userEvent }) => {
        submitMagazineStep.mockClear()

        await userEvent.type(
            canvas.getByLabelText(/magazine name/i, { selector: 'input' }),
            'Good Food',
        )
        await userEvent.type(canvas.getByLabelText(/issue/i, { selector: 'input' }), 'April 2026')
        await userEvent.type(canvas.getByLabelText(/page/i, { selector: 'input' }), '42')

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(submitMagazineStep).toHaveBeenCalledWith({
                mealTime: '',
                source: '',
                bookTitle: '',
                pageNumber: '',
                series: '',
                recipeUrl: '',
                magazineName: 'Good Food',
                magazineIssue: 'April 2026',
                magazinePage: '42',
                internalRecipeId: '',
                prepDuration: '',
                cookingDuration: '',
                standingTime: '',
            })
        })
    },
}

export const RequiresMagazineFields: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByText(/magazine name is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/issue is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/page is required/i)).toBeInTheDocument()
        })
    },
}
