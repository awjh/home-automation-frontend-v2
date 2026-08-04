import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { type IngredientsFormSection } from '../IngredientsForm/IngredientsSectionForm/IngredientsSectionForm'
import MethodForm from './MethodForm'

const onNext = fn()
const onBack = fn()

const ingredientSections: IngredientsFormSection[] = [
    {
        name: 'Main Recipe',
        ingredients: [
            {
                quantity: '2',
                measure: 'tbsp',
                item: 'Olive oil',
                preparation: '',
            },
            {
                quantity: '1',
                measure: 'whole',
                item: 'Onion',
                preparation: 'finely diced',
            },
        ],
    },
]

const meta: Meta<typeof MethodForm> = {
    title: 'Features/Recipes/AddRecipe/MethodForm',
    component: MethodForm,
    decorators: [
        (Story) => (
            <Box p={4}>
                <Story />
            </Box>
        ),
    ],
    args: {
        onNext,
        onBack,
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CanAddMethodStepWithEnter: Story = {
    play: async ({ canvas, userEvent }) => {
        const inputs = canvas.getAllByRole('textbox')

        await userEvent.type(inputs[0], 'Preheat oven')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            const updatedInputs = canvas.getAllByRole('textbox')

            expect(updatedInputs).toHaveLength(2)
            expect(updatedInputs[0]).toHaveValue('Preheat oven')
            expect(updatedInputs[1]).toHaveValue('')
            expect(canvas.getByText('1.')).toBeInTheDocument()
            expect(canvas.queryByText('2.')).not.toBeInTheDocument()
        })
    },
}

export const AddedMethodStepRemainsEditable: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()

        const inputs = canvas.getAllByRole('textbox')

        await userEvent.type(inputs[0], 'Preheat oven')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(2)
        })

        const updatedInputs = canvas.getAllByRole('textbox')

        await userEvent.clear(updatedInputs[0])
        await userEvent.type(updatedInputs[0], 'Preheat oven to 180C')

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledOnce()
            expect(args.onNext).toHaveBeenCalledWith({
                steps: [
                    {
                        description: 'Preheat oven to 180C',
                        ingredients: [],
                    },
                ],
            })
        })
    },
}

export const EnterDoesNotCreateNewLine: Story = {
    play: async ({ canvas, userEvent }) => {
        const inputs = canvas.getAllByRole('textbox')

        await userEvent.type(inputs[0], 'Mix ingredients')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            const updatedInputs = canvas.getAllByRole('textbox')

            expect(updatedInputs[0]).toHaveValue('Mix ingredients')
            expect(updatedInputs[0]).not.toHaveValue('Mix ingredients\n')
        })
    },
}

export const ShowsAlertWhenDraftStepIsNotSubmitted: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()

        const alertSpy = fn()
        const originalAlert = window.alert
        window.alert = alertSpy

        try {
            const inputs = canvas.getAllByRole('textbox')

            await userEvent.type(inputs[0], 'Keep this as draft')
            await userEvent.click(canvas.getByRole('button', { name: /next/i }))

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledOnce()
                expect(args.onNext).not.toHaveBeenCalled()
            })
        } finally {
            window.alert = originalAlert
        }
    },
}

export const CanDeleteMethodRow: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()

        const inputs = canvas.getAllByRole('textbox')

        await userEvent.type(inputs[0], 'Step one')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(2)
        })

        const secondInputs = canvas.getAllByRole('textbox')
        await userEvent.type(secondInputs[1], 'Step two')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(3)
            expect(canvas.getByDisplayValue('Step one')).toBeInTheDocument()
            expect(canvas.getByDisplayValue('Step two')).toBeInTheDocument()
        })

        const deleteButtons = canvas.getAllByRole('button', { name: /delete method step/i })
        await userEvent.click(deleteButtons[0])

        await waitFor(() => {
            expect(canvas.queryByDisplayValue('Step one')).not.toBeInTheDocument()
            expect(canvas.getByDisplayValue('Step two')).toBeInTheDocument()
            expect(canvas.getByText('1.')).toBeInTheDocument()
            expect(canvas.queryByText('2.')).not.toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledOnce()
            expect(args.onNext).toHaveBeenCalledWith({
                steps: [
                    {
                        description: 'Step two',
                        ingredients: [],
                    },
                ],
            })
        })
    },
}

export const CanAddStepThenSelectIngredient: Story = {
    args: {
        ingredientSections,
    },
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()

        const inputs = canvas.getAllByRole('textbox')

        await userEvent.type(inputs[0], 'Saute vegetables')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getByDisplayValue('Saute vegetables')).toBeInTheDocument()
            expect(
                canvas.getByRole('button', { name: /edit method ingredients/i }),
            ).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /edit method ingredients/i }))

        const popup = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        const popupCanvas = within(popup)

        const draftSelect = popupCanvas.getByLabelText('ingredient-draft')
        await userEvent.selectOptions(draftSelect, 'section-0-ingredient-1')

        await waitFor(() => {
            expect(popupCanvas.getByDisplayValue('1')).toBeInTheDocument()
            expect(popupCanvas.getByDisplayValue('whole')).toBeInTheDocument()
        })

        await userEvent.click(popupCanvas.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(canvas.queryByTestId('method-ingredients-popup-0')).not.toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledOnce()
            expect(args.onNext).toHaveBeenCalledWith({
                steps: [
                    {
                        description: 'Saute vegetables',
                        ingredients: [
                            {
                                item: 'Onion',
                                quantity: 1,
                                measure: 'whole',
                                preparation: 'finely diced',
                                internalRecipe: undefined,
                            },
                        ],
                    },
                ],
            })
        })
    },
}

export const CanReopenIngredientPopupAndAddAnotherIngredient: Story = {
    args: {
        ingredientSections,
    },
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()

        const inputs = canvas.getAllByRole('textbox')

        await userEvent.type(inputs[0], 'Cook filling')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getByDisplayValue('Cook filling')).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /edit method ingredients/i }))

        let popup = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        let popupCanvas = within(popup)

        await userEvent.selectOptions(
            popupCanvas.getByLabelText('ingredient-draft'),
            'section-0-ingredient-0',
        )
        await userEvent.click(popupCanvas.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(canvas.queryByTestId('method-ingredients-popup-0')).not.toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /edit method ingredients/i }))

        popup = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        popupCanvas = within(popup)

        await waitFor(() => {
            expect(popupCanvas.getByDisplayValue('Olive oil')).toBeInTheDocument()
        })

        await userEvent.selectOptions(
            popupCanvas.getByLabelText('ingredient-draft'),
            'section-0-ingredient-1',
        )
        await userEvent.click(popupCanvas.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(canvas.queryByTestId('method-ingredients-popup-0')).not.toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledOnce()
            expect(args.onNext).toHaveBeenCalledWith({
                steps: [
                    {
                        description: 'Cook filling',
                        ingredients: [
                            {
                                item: 'Olive oil',
                                quantity: 2,
                                measure: 'tbsp',
                                preparation: undefined,
                                internalRecipe: undefined,
                            },
                            {
                                item: 'Onion',
                                quantity: 1,
                                measure: 'whole',
                                preparation: 'finely diced',
                                internalRecipe: undefined,
                            },
                        ],
                    },
                ],
            })
        })
    },
}

export const CanReopenIngredientPopupAndCancelToKeepExistingIngredients: Story = {
    args: {
        ingredientSections,
    },
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()

        const inputs = canvas.getAllByRole('textbox')

        await userEvent.type(inputs[0], 'Cook filling')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getByDisplayValue('Cook filling')).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /edit method ingredients/i }))

        let popup = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        let popupCanvas = within(popup)

        await userEvent.selectOptions(
            popupCanvas.getByLabelText('ingredient-draft'),
            'section-0-ingredient-0',
        )
        await userEvent.click(popupCanvas.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(canvas.queryByTestId('method-ingredients-popup-0')).not.toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /edit method ingredients/i }))

        popup = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        popupCanvas = within(popup)

        await userEvent.selectOptions(
            popupCanvas.getByLabelText('ingredient-draft'),
            'section-0-ingredient-1',
        )

        await waitFor(() => {
            expect(popupCanvas.getByDisplayValue('Onion, finely diced')).toBeInTheDocument()
        })

        await userEvent.click(popupCanvas.getByRole('button', { name: /cancel/i }))

        await waitFor(() => {
            expect(canvas.queryByTestId('method-ingredients-popup-0')).not.toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledOnce()
            expect(args.onNext).toHaveBeenCalledWith({
                steps: [
                    {
                        description: 'Cook filling',
                        ingredients: [
                            {
                                item: 'Olive oil',
                                quantity: 2,
                                measure: 'tbsp',
                                preparation: undefined,
                                internalRecipe: undefined,
                            },
                        ],
                    },
                ],
            })
        })
    },
}
