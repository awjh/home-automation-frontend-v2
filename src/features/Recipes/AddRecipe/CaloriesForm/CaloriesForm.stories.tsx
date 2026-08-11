import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import CaloriesForm from './CaloriesForm'
import { ProducesType } from '../BasicDetailsForm/BasicDetailsForm'

const onNext = fn()
const onBack = fn()

const meta: Meta<typeof CaloriesForm> = {
    title: 'Features/Recipes/AddRecipe/CaloriesForm',
    component: CaloriesForm,
    decorators: [(Story) => <Story />],
    args: {
        onNext,
        onBack,
        ingredientSections: [
            {
                name: 'Section 1',
                ingredients: [
                    {
                        quantity: '100',
                        measure: 'g',
                        item: 'chicken breast',
                        preparation: '',
                    },
                    {
                        quantity: '200',
                        measure: 'ml',
                        item: 'double cream',
                        preparation: '',
                    },
                ],
            },
            {
                name: 'Section 2',
                ingredients: [
                    {
                        quantity: '1',
                        measure: 'tbsp',
                        item: 'olive oil',
                        preparation: '',
                    },
                ],
            },
        ],
        produces: {
            producesType: ProducesType.QUANTITY,
            measureProduced: 'g',
            quantityProduced: '300',
            serves: '',
        },
        calculateCalories: async () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        calories: 500,
                        unresolvedIngredients: [],
                    })
                }, 250)
            })
        },
    },
}

export default meta
type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

async function clickLookupCalories(
    canvas: PlayContext['canvas'],
    userEvent: PlayContext['userEvent'],
) {
    await userEvent.click(canvas.getByRole('button', { name: /lookup calories/i }))
}

export const Default: Story = {}

export const LookupSuccess: Story = {
    play: async ({ canvas, userEvent }) => {
        await clickLookupCalories(canvas, userEvent)

        await waitFor(() => {
            expect(canvas.getByLabelText(/calories/i, { selector: 'input' })).toHaveValue(500)
        })
    },
}

export const WithUnresolvedIngredients: Story = {
    args: {
        calculateCalories: async () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        calories: 500,
                        unresolvedIngredients: [0, 2],
                    })
                }, 250)
            })
        },
    },
    play: async ({ canvas, userEvent }) => {
        await clickLookupCalories(canvas, userEvent)

        await waitFor(() => {
            expect(canvas.getByLabelText(/calories/i, { selector: 'input' })).toHaveValue(500)
            expect(
                canvas.getByText(/the following ingredients could not be resolved:/i),
            ).toBeInTheDocument()
        })
    },
}

export const LookupError: Story = {
    args: {
        calculateCalories: async () => {
            return new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Failed to calculate calories'))
                }, 250)
            })
        },
    },
    play: async ({ canvas, userEvent }) => {
        await clickLookupCalories(canvas, userEvent)

        await waitFor(() => {
            expect(canvas.getByLabelText(/calories/i, { selector: 'input' })).toHaveValue(0)
            expect(
                canvas.queryByText(/the following ingredients could not be resolved:/i),
            ).not.toBeInTheDocument()
        })
    },
}

export const CanGoNext: Story = {
    play: async ({ args, canvas, userEvent }) => {
        onNext.mockClear()
        onBack.mockClear()

        await userEvent.clear(canvas.getByLabelText(/calories/i, { selector: 'input' }))
        await userEvent.type(canvas.getByLabelText(/calories/i, { selector: 'input' }), '650')
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledWith({ calories: '650' })
            expect(args.onBack).not.toHaveBeenCalled()
        })
    },
}

export const CanGoBack: Story = {
    play: async ({ args, canvas, userEvent }) => {
        onNext.mockClear()
        onBack.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /back/i }))

        await waitFor(() => {
            expect(args.onBack).toHaveBeenCalledOnce()
            expect(args.onNext).not.toHaveBeenCalled()
        })
    },
}
