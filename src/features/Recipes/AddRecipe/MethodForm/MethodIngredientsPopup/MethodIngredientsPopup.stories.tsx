import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { type IngredientsFormSection } from '../../IngredientsForm/IngredientsSectionForm/IngredientsSectionForm'
import MethodIngredientsPopup from './MethodIngredientsPopup'

const onSave = fn()
const onCancel = fn()

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
    {
        name: 'Sauce',
        ingredients: [
            {
                quantity: '1',
                measure: 'whole',
                item: 'Onion',
                preparation: 'thinly sliced',
            },
            {
                quantity: '400',
                measure: 'ml',
                item: 'Stock',
                preparation: '',
            },
        ],
    },
]

const meta: Meta<typeof MethodIngredientsPopup> = {
    title: 'Features/Recipes/AddRecipe/MethodForm/MethodIngredientsPopup',
    component: MethodIngredientsPopup,
    decorators: [
        (Story) => (
            <Box p={4} minH={'100vh'}>
                <Story />
            </Box>
        ),
    ],
    args: {
        stepIndex: 0,
        ingredientSections,
        initialIngredients: [],
        onSave,
        onCancel,
    },
}

export default meta
type Story = StoryObj<typeof MethodIngredientsPopup>

export const Default: Story = {
    play: async ({ canvas }) => {
        const modal = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))

        expect(within(modal).getByText(/ingredients for step 1/i)).toBeInTheDocument()
        expect(within(modal).getByRole('combobox')).toBeInTheDocument()
        expect(
            within(modal).queryByRole('button', { name: /delete method ingredient/i }),
        ).toBeNull()
    },
}

export const CanAddIngredientWithDefaultQuantityAndMeasure: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onSave.mockClear()

        const modal = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        const modalCanvas = within(modal)

        const draftSelect = modalCanvas.getByLabelText('ingredient-draft')
        await userEvent.selectOptions(draftSelect, 'section-0-ingredient-0')

        await waitFor(() => {
            expect(modalCanvas.getByDisplayValue('2')).toBeInTheDocument()
            expect(modalCanvas.getByDisplayValue('tbsp')).toBeInTheDocument()
        })

        await userEvent.click(modalCanvas.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(args.onSave).toHaveBeenCalledOnce()
            expect(args.onSave).toHaveBeenCalledWith([
                {
                    item: 'Olive oil',
                    quantity: 2,
                    measure: 'tbsp',
                    preparation: undefined,
                    internalRecipe: undefined,
                },
            ])
        })
    },
}

export const CanAddMultipleIngredients: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onSave.mockClear()

        const modal = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        const modalCanvas = within(modal)

        const draftSelect = modalCanvas.getByLabelText('ingredient-draft')
        await userEvent.selectOptions(draftSelect, 'section-0-ingredient-1')

        await waitFor(() => {
            expect(modalCanvas.getByDisplayValue('1')).toBeInTheDocument()
            expect(modalCanvas.getByDisplayValue('whole')).toBeInTheDocument()
        })

        const secondDraftSelect = modalCanvas.getByLabelText('ingredient-draft')
        await userEvent.selectOptions(secondDraftSelect, 'section-1-ingredient-0')

        await waitFor(() => {
            const deleteButtons = modalCanvas.getAllByRole('button', {
                name: /delete method ingredient/i,
            })
            expect(deleteButtons).toHaveLength(2)
        })

        await userEvent.click(modalCanvas.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(args.onSave).toHaveBeenCalledOnce()
            expect(args.onSave).toHaveBeenCalledWith([
                {
                    item: 'Onion',
                    quantity: 1,
                    measure: 'whole',
                    preparation: 'finely diced',
                    internalRecipe: undefined,
                },
                {
                    item: 'Onion',
                    quantity: 1,
                    measure: 'whole',
                    preparation: 'thinly sliced',
                    internalRecipe: undefined,
                },
            ])
        })
    },
}

export const CanAddIngredientAndEditQuantityAndMeasure: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onSave.mockClear()

        const modal = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        const modalCanvas = within(modal)

        const draftSelect = modalCanvas.getByLabelText('ingredient-draft')
        await userEvent.selectOptions(draftSelect, 'section-1-ingredient-1')

        const quantityInput = await waitFor(() => modalCanvas.getByDisplayValue('400'))
        const measureInput = await waitFor(() => modalCanvas.getByDisplayValue('ml'))

        await userEvent.clear(quantityInput)
        await userEvent.type(quantityInput, '300')
        await userEvent.clear(measureInput)
        await userEvent.type(measureInput, 'g')

        await userEvent.click(modalCanvas.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(args.onSave).toHaveBeenCalledOnce()
            expect(args.onSave).toHaveBeenCalledWith([
                {
                    item: 'Stock',
                    quantity: 300,
                    measure: 'g',
                    preparation: undefined,
                    internalRecipe: undefined,
                },
            ])
        })
    },
}

export const CanCancelWithoutSaving: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onSave.mockClear()
        onCancel.mockClear()

        const modal = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        const modalCanvas = within(modal)

        const draftSelect = modalCanvas.getByLabelText('ingredient-draft')
        await userEvent.selectOptions(draftSelect, 'section-0-ingredient-0')

        await userEvent.click(modalCanvas.getByRole('button', { name: /cancel/i }))

        await waitFor(() => {
            expect(args.onCancel).toHaveBeenCalledOnce()
            expect(args.onSave).not.toHaveBeenCalled()
        })
    },
}

export const CanDeleteIngredientAndExcludeFromSave: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onSave.mockClear()

        const modal = await waitFor(() => canvas.getByTestId('method-ingredients-popup-0'))
        const modalCanvas = within(modal)

        const draftSelect = modalCanvas.getByLabelText('ingredient-draft')
        await userEvent.selectOptions(draftSelect, 'section-0-ingredient-0')

        const secondDraftSelect = modalCanvas.getByLabelText('ingredient-draft')
        await userEvent.selectOptions(secondDraftSelect, 'section-1-ingredient-1')

        await waitFor(() => {
            expect(modalCanvas.getByDisplayValue('Olive oil')).toBeInTheDocument()
            expect(modalCanvas.getByDisplayValue('Stock')).toBeInTheDocument()
            expect(
                modalCanvas.getAllByRole('button', { name: /delete method ingredient/i }),
            ).toHaveLength(2)
        })

        const deleteButtons = modalCanvas.getAllByRole('button', {
            name: /delete method ingredient/i,
        })
        await userEvent.click(deleteButtons[0])

        await waitFor(() => {
            expect(modalCanvas.queryByDisplayValue('Olive oil')).not.toBeInTheDocument()
            expect(modalCanvas.getByDisplayValue('Stock')).toBeInTheDocument()
            expect(
                modalCanvas.getAllByRole('button', { name: /delete method ingredient/i }),
            ).toHaveLength(1)
        })

        await userEvent.click(modalCanvas.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(args.onSave).toHaveBeenCalledOnce()
            expect(args.onSave).toHaveBeenCalledWith([
                {
                    item: 'Stock',
                    quantity: 400,
                    measure: 'ml',
                    preparation: undefined,
                    internalRecipe: undefined,
                },
            ])
        })
    },
}
