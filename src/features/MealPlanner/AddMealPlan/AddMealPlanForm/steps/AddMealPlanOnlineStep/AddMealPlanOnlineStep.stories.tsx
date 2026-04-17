import { GetExtractedExternalRecipeResponse } from '@awjh/home-automation-v2-api-models'
import { Flex, VStack } from '@chakra-ui/react'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm } from 'react-hook-form'
import { expect, fn, waitFor } from 'storybook/test'
import AddMealPlanOnlineStep from './AddMealPlanOnlineStep'

interface StoryWrapperProps {
    extractTitleFromOnlineSource?: (url: string) => Promise<GetExtractedExternalRecipeResponse>
    onBack?: () => void
    onSubmit?: (values: AddMealPlanFormValues) => void
    defaultValues?: Partial<AddMealPlanFormValues>
}

const extractedRecipe = {
    title: 'Weeknight Lasagne',
    duration: {
        prepDuration: 15,
        cookingDuration: 35,
        standingTime: 5,
    },
} satisfies GetExtractedExternalRecipeResponse

function StoryWrapper({
    extractTitleFromOnlineSource = fn(async () => extractedRecipe),
    onBack = fn(),
    onSubmit = fn(),
    defaultValues,
}: StoryWrapperProps) {
    const {
        control,
        handleSubmit,
        setValue,
        trigger,
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
                    void handleSubmit(onSubmit)()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <AddMealPlanOnlineStep
                        control={control}
                        errors={errors}
                        extractTitleFromOnlineSource={extractTitleFromOnlineSource}
                        onBack={onBack}
                        setValue={setValue}
                        trigger={trigger}
                    />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanOnlineStep> = {
    title: 'Features/MealPlanner/AddMealPlan/AddMealPlanForm/Steps/AddMealPlanOnlineStep',
    component: AddMealPlanOnlineStep,
    render: (args) => <StoryWrapper {...args} />,
    args: {
        extractTitleFromOnlineSource: fn(async () => extractedRecipe),
        onBack: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanOnlineStep>

export const Default: Story = {}

export const RequiresValidUrl: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByText(/recipe url is required/i)).toBeInTheDocument()
        })
    },
}

const submitSpy = fn()

export const ExtractsRecipeDetails: Story = {
    render: (args) => <StoryWrapper {...args} onSubmit={submitSpy} />,
    play: async ({ canvas, userEvent, args }) => {
        submitSpy.mockClear()

        await userEvent.type(
            canvas.getByLabelText(/recipe url/i, { selector: 'input' }),
            'https://example.com/recipes/weeknight-lasagne',
        )
        await userEvent.click(canvas.getByRole('button', { name: /extract details/i }))
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.extractTitleFromOnlineSource).toHaveBeenCalledWith(
                'https://example.com/recipes/weeknight-lasagne',
            )
            expect(submitSpy).toHaveBeenCalledWith(
                {
                    mealTime: '',
                    source: '',
                    title: 'Weeknight Lasagne',
                    author: '',
                    bookTitle: '',
                    pageNumber: '',
                    series: '',
                    recipeUrl: 'https://example.com/recipes/weeknight-lasagne',
                    magazineName: '',
                    magazineIssue: '',
                    magazinePage: '',
                    internalRecipeId: '',
                    prepDuration: '15',
                    cookingDuration: '35',
                    standingTime: '5',
                },
                undefined,
            )
        })
    },
}

export const ShowsExtractionError: Story = {
    args: {
        extractTitleFromOnlineSource: fn(async () => {
            throw new Error('Extraction failed')
        }),
    },
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.type(
            canvas.getByLabelText(/recipe url/i, { selector: 'input' }),
            'https://example.com/recipes/unavailable',
        )
        await userEvent.click(canvas.getByRole('button', { name: /extract details/i }))

        await waitFor(() => {
            expect(args.extractTitleFromOnlineSource).toHaveBeenCalledWith(
                'https://example.com/recipes/unavailable',
            )
            expect(
                canvas.getByText(/unable to extract recipe details right now/i),
            ).toBeInTheDocument()
        })
    },
}
