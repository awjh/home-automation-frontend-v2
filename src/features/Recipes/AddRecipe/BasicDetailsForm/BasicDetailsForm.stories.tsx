import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import BasicDetailsForm from './BasicDetailsForm'

const onNext = fn()
const onBack = fn()

const meta: Meta<typeof BasicDetailsForm> = {
    title: 'Features/AddRecipe/BasicDetailsForm',
    component: BasicDetailsForm,
    decorators: [(Story) => <Story />],
    args: {
        onNext,
        onBack,
    },
}

export default meta
type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function fillBaseDetails(canvas: PlayContext['canvas'], userEvent: PlayContext['userEvent']) {
    await userEvent.type(
        canvas.getByLabelText(/recipe title/i, { selector: 'input' }),
        'Tomato Pasta',
    )
    await userEvent.type(
        canvas.getByLabelText(/recipe author/i, { selector: 'input' }),
        'Alice Cook',
    )
    await userEvent.type(
        canvas.getByLabelText(/recipe image/i, { selector: 'input' }),
        'https://example.com/pasta.jpg',
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
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /back/i }))

        await waitFor(() => {
            expect(args.onBack).toHaveBeenCalledTimes(1)
        })
    },
}

export const CanGoNext: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        await fillBaseDetails(canvas, userEvent)

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    authors: ['Alice Cook'],
                    recipeTitle: 'Tomato Pasta',
                    image: 'https://example.com/pasta.jpg',
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
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(canvas.getByText(/recipe title is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/at least one author is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/cooking duration is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/preparation duration is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/standing time is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/number of portions is required/i)).toBeInTheDocument()
            expect(args.onNext).not.toHaveBeenCalled()
        })
    },
}

export const CanAddMultipleAuthors: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

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

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    authors: ['Alice Cook', 'Bob Baker'],
                    recipeTitle: 'Tomato Pasta',
                    image: 'https://example.com/pasta.jpg',
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
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

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

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    authors: ['Alice Cook'],
                    recipeTitle: 'Tomato Pasta',
                    image: 'https://example.com/pasta.jpg',
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
