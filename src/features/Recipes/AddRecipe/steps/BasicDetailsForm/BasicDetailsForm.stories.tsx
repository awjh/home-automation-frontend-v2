import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, waitFor } from 'storybook/test'
import BasicDetailsForm from './BasicDetailsForm'

const onSubmitStep = fn()

const meta: Meta<typeof BasicDetailsForm> = {
    title: 'Features/Recipes/AddRecipe/AddRecipeForm/steps/BasicDetailsForm',
    component: BasicDetailsForm,
    decorators: [(Story) => <Story />],
    args: {
        onSubmitStep,
    },
}

export default meta
type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

function submitCurrentForm(canvasElement: HTMLElement) {
    const form = canvasElement.querySelector('form')
    expect(form).not.toBeNull()
    fireEvent.submit(form as HTMLFormElement)
}

async function fillBaseDetails(canvas: PlayContext['canvas'], userEvent: PlayContext['userEvent']) {
    await userEvent.type(
        canvas.getByLabelText(/recipe title/i, { selector: 'input' }),
        'Tomato Pasta',
    )
    await userEvent.type(
        canvas.getByLabelText(/recipe author/i, { selector: 'input' }),
        'Alice Cook',
    )
    await userEvent.type(canvas.getByLabelText(/cooking duration/i, { selector: 'input' }), '25')
    await userEvent.type(
        canvas.getByLabelText(/preparation duration/i, { selector: 'input' }),
        '10',
    )
    await userEvent.type(canvas.getByLabelText(/standing time/i, { selector: 'input' }), '5')
    await userEvent.type(canvas.getByLabelText(/serves/i, { selector: 'input' }), '4')
}

export const Default: Story = {}

export const CanGoBack: Story = {
    play: async ({ canvas, canvasElement }) => {
        expect(canvas.queryByRole('button', { name: /back/i })).not.toBeInTheDocument()
        expect(canvas.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
        submitCurrentForm(canvasElement)
    },
}

export const CanGoNext: Story = {
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        onSubmitStep.mockClear()

        await fillBaseDetails(canvas, userEvent)
        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(args.onSubmitStep).toHaveBeenCalledWith(
                expect.objectContaining({
                    authors: ['Alice Cook'],
                    recipeTitle: 'Tomato Pasta',
                    cookingDuration: '25',
                    prepDuration: '10',
                    standingTime: '5',
                    serves: '4',
                    producesType: 'portions',
                }),
            )
        })
    },
}

export const ShowsValidationErrorsWhenRequiredFieldsAreMissing: Story = {
    play: async ({ canvas, canvasElement, args }) => {
        onSubmitStep.mockClear()

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(canvas.getByText(/recipe title is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/at least one author is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/cooking duration is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/preparation duration is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/standing time is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/number of portions is required/i)).toBeInTheDocument()
            expect(args.onSubmitStep).not.toHaveBeenCalled()
        })
    },
}

export const CanAddMultipleAuthors: Story = {
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        onSubmitStep.mockClear()

        await fillBaseDetails(canvas, userEvent)

        await userEvent.click(canvas.getByRole('button', { name: /add another author/i }))

        await waitFor(() => {
            expect(
                canvas.getByLabelText(/recipe author 2/i, { selector: 'input' }),
            ).toBeInTheDocument()
        })

        await userEvent.type(
            canvas.getByLabelText(/recipe author 2/i, { selector: 'input' }),
            'Bob Baker',
        )

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(args.onSubmitStep).toHaveBeenCalledWith(
                expect.objectContaining({
                    authors: ['Alice Cook', 'Bob Baker'],
                    recipeTitle: 'Tomato Pasta',
                    cookingDuration: '25',
                    prepDuration: '10',
                    standingTime: '5',
                    serves: '4',
                    producesType: 'portions',
                }),
            )
        })
    },
}

export const CanSelectQuantityProduced: Story = {
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        onSubmitStep.mockClear()

        await fillBaseDetails(canvas, userEvent)

        await userEvent.selectOptions(
            canvas.getByLabelText(/what does this recipe produce/i, { selector: 'select' }),
            'quantity',
        )

        await waitFor(() => {
            expect(
                canvas.getByLabelText(/quantity produced/i, { selector: 'input' }),
            ).toBeInTheDocument()
            expect(
                canvas.getByLabelText(/measure produced/i, { selector: 'input' }),
            ).toBeInTheDocument()
        })

        await userEvent.type(
            canvas.getByLabelText(/quantity produced/i, { selector: 'input' }),
            '12',
        )
        await userEvent.type(
            canvas.getByLabelText(/measure produced/i, { selector: 'input' }),
            'cookies',
        )

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(args.onSubmitStep).toHaveBeenCalledWith(
                expect.objectContaining({
                    authors: ['Alice Cook'],
                    recipeTitle: 'Tomato Pasta',
                    cookingDuration: '25',
                    prepDuration: '10',
                    standingTime: '5',
                    producesType: 'quantity',
                    quantityProduced: '12',
                    measureProduced: 'cookies',
                }),
            )
        })
    },
}
