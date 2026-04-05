import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Flex, VStack } from '@chakra-ui/react'
import { AddMealPlanFormValues } from '@organisms/AddMealPlan/AddMealPlan.types'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import AddMealPlanTitleAuthorStep from './AddMealPlanTitleAuthorStep'

const submitDetailsStep = fn()

interface StoryWrapperProps {
    onBack?: () => void
    defaultValues?: Partial<AddMealPlanFormValues>
    authorLabel?: string
    showAuthor?: boolean
}

function StoryWrapper({
    onBack = fn(),
    defaultValues,
    authorLabel,
    showAuthor,
}: StoryWrapperProps) {
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
                    void handleSubmit((values) => submitDetailsStep(values))()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <AddMealPlanTitleAuthorStep
                        control={control}
                        errors={errors}
                        onBack={onBack}
                        authorLabel={authorLabel}
                        showAuthor={showAuthor}
                    />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanTitleAuthorStep> = {
    title: 'Molecules/AddMealPlanTitleAuthorStep',
    component: AddMealPlanTitleAuthorStep,
    render: (args) => <StoryWrapper {...args} />,
    args: {
        onBack: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanTitleAuthorStep>

export const Default: Story = {}

export const FreezerOmitsAuthorField: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            defaultValues={{ source: SourceType.FREEZER, title: 'Chicken Satay' }}
            showAuthor={false}
        />
    ),
    play: async ({ canvas, userEvent }) => {
        submitDetailsStep.mockClear()

        expect(canvas.queryByLabelText(/author/i)).not.toBeInTheDocument()
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(submitDetailsStep).toHaveBeenCalledWith({
                mealTime: '',
                source: SourceType.FREEZER,
                title: 'Chicken Satay',
                author: '',
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

export const ReadyPreparedUsesProducerLabel: Story = {
    render: (args) => (
        <StoryWrapper
            {...args}
            defaultValues={{ source: SourceType.READY_PREPARED }}
            authorLabel={'Producer'}
        />
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByLabelText(/producer/i)).toBeInTheDocument()
            expect(canvas.getByText(/title is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/producer is required/i)).toBeInTheDocument()
        })
    },
}
