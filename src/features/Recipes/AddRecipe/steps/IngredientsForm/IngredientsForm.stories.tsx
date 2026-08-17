import { expect, fireEvent, fn, waitFor } from 'storybook/test'
import IngredientsForm from './IngredientsForm'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@chakra-ui/react'
import searchRecipes from '@test/storybookHelpers/searchRecipes'

const onNext = fn()
const onBack = fn()

const meta: Meta<typeof IngredientsForm> = {
    title: 'Features/Recipes/AddRecipe/AddRecipeForm/steps/IngredientsForm',
    component: IngredientsForm,
    decorators: [
        (Story) => (
            <Box p={4}>
                <Story />
            </Box>
        ),
    ],
    args: {
        searchInternalRecipes: searchRecipes,
        onNext,
        onBack,
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

export const Default: Story = {}

export const CanDeleteSectionAndIngredients: Story = {
    play: async ({ canvas, userEvent }: PlayContext) => {
        await userEvent.click(canvas.getByRole('button', { name: /add section/i }))

        await waitFor(() => {
            expect(canvas.getByText('section 2')).toBeInTheDocument()
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })

        const sectionTextboxes = canvas.getAllByRole('textbox')
        await userEvent.type(sectionTextboxes[4], '3')
        await userEvent.type(sectionTextboxes[6], 'Beans')

        const deleteButtons = canvas.getAllByRole('button', { name: /delete section/i })
        await userEvent.click(deleteButtons[1])

        await waitFor(() => {
            expect(canvas.getByText('Delete Section?')).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /confirm/i }))

        await waitFor(() => {
            expect(canvas.queryByText('section 2')).not.toBeInTheDocument()
            expect(canvas.queryByDisplayValue('3')).not.toBeInTheDocument()
            expect(canvas.queryByDisplayValue('Beans')).not.toBeInTheDocument()
            expect(canvas.getAllByRole('textbox')).toHaveLength(4)
        })
    },
}

export const CanDeleteOnlyIngredientRow: Story = {
    play: async ({ canvas, canvasElement, userEvent }: PlayContext) => {
        onNext.mockClear()

        const firstDraftRow = canvas.getAllByRole('textbox')
        await userEvent.type(firstDraftRow[0], '1')
        await userEvent.type(firstDraftRow[2], 'Onion')
        await userEvent.click(firstDraftRow[2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })

        const secondDraftRow = canvas.getAllByRole('textbox')
        await userEvent.type(secondDraftRow[4], '2')
        await userEvent.type(secondDraftRow[6], 'Garlic')
        await userEvent.click(secondDraftRow[6])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(12)
            expect(canvas.getByDisplayValue('Onion')).toBeInTheDocument()
            expect(canvas.getByDisplayValue('Garlic')).toBeInTheDocument()
        })

        const deleteButtons = canvas.getAllByRole('button', { name: /delete ingredient/i })
        await userEvent.click(deleteButtons[0])

        await waitFor(() => {
            expect(canvas.queryByDisplayValue('Onion')).not.toBeInTheDocument()
            expect(canvas.getByDisplayValue('Garlic')).toBeInTheDocument()
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(onNext).toHaveBeenCalledOnce()
            expect(onNext).toHaveBeenCalledWith({
                sections: [
                    {
                        name: 'Main Recipe',
                        ingredients: [
                            {
                                quantity: '2',
                                measure: '',
                                item: 'Garlic',
                                preparation: '',
                            },
                        ],
                    },
                ],
            })
        })
    },
}

export const CanSubmitWithIngredients: Story = {
    play: async ({ canvas, canvasElement, userEvent }: PlayContext) => {
        onNext.mockClear()

        const textboxes = canvas.getAllByRole('textbox')
        await userEvent.type(textboxes[0], '2')
        await userEvent.type(textboxes[2], 'Tomatoes')
        await userEvent.click(textboxes[2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(onNext).toHaveBeenCalledOnce()
            expect(onNext).toHaveBeenCalledWith({
                sections: [
                    {
                        name: 'Main Recipe',
                        ingredients: [
                            {
                                quantity: '2',
                                measure: '',
                                item: 'Tomatoes',
                                preparation: '',
                            },
                        ],
                    },
                ],
            })
        })
    },
}

export const CanSubmitWithIngredientsAcrossSections: Story = {
    play: async ({ canvas, canvasElement, userEvent }: PlayContext) => {
        onNext.mockClear()

        let textboxes = canvas.getAllByRole('textbox')
        await userEvent.type(textboxes[0], '1')
        await userEvent.type(textboxes[2], 'Onion')
        await userEvent.click(textboxes[2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })

        await userEvent.click(canvas.getByRole('button', { name: /add section/i }))

        await waitFor(() => {
            expect(canvas.getByText('section 2')).toBeInTheDocument()
            expect(canvas.getAllByRole('textbox')).toHaveLength(12)
        })

        textboxes = canvas.getAllByRole('textbox')
        await userEvent.type(textboxes[8], '4')
        await userEvent.type(textboxes[10], 'Carrots')
        await userEvent.click(textboxes[10])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(16)
        })

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(onNext).toHaveBeenCalledOnce()
            expect(onNext).toHaveBeenCalledWith({
                sections: [
                    {
                        name: 'Main Recipe',
                        ingredients: [
                            {
                                quantity: '1',
                                measure: '',
                                item: 'Onion',
                                preparation: '',
                            },
                        ],
                    },
                    {
                        name: 'section 2',
                        ingredients: [
                            {
                                quantity: '4',
                                measure: '',
                                item: 'Carrots',
                                preparation: '',
                            },
                        ],
                    },
                ],
            })
        })
    },
}

// This is failing since it seems to try and validate on the draft row - can we just turn off validation for the draft row? Let it validate theres a value or when its moved instead?
export const CanDragIngredientBetweenSectionsAndSubmit: Story = {
    play: async ({ canvas, canvasElement, userEvent }: PlayContext) => {
        onNext.mockClear()
        const alertSpy = fn()
        const originalAlert = window.alert
        window.alert = alertSpy

        try {
            expect(canvas.queryByRole('button', { name: /enter drag and drop mode/i })).toBeNull()

            const textboxes = canvas.getAllByRole('textbox')
            await userEvent.type(textboxes[0], '1')
            await userEvent.type(textboxes[2], 'Onion')
            await userEvent.click(textboxes[2])
            await userEvent.keyboard('{Enter}')

            await waitFor(() => {
                expect(canvas.getAllByRole('textbox')).toHaveLength(8)
            })

            const textboxes2 = canvas.getAllByRole('textbox')
            await userEvent.type(textboxes2[4], '2')
            await userEvent.type(textboxes2[6], 'Garlic')
            await userEvent.click(textboxes2[6])
            await userEvent.keyboard('{Enter}')

            await waitFor(() => {
                expect(canvas.getAllByRole('textbox')).toHaveLength(12)
            })

            await userEvent.click(canvas.getByRole('button', { name: /add section/i }))

            await waitFor(() => {
                expect(canvas.getByText('section 2')).toBeInTheDocument()
                expect(
                    canvas.getByRole('button', { name: /enter drag and drop mode/i }),
                ).toBeInTheDocument()
            })

            await userEvent.click(canvas.getByRole('button', { name: /enter drag and drop mode/i }))

            const dragButton = canvas.getByTestId('drag-ingredient-button-0-0')
            const targetSectionHeading = canvas.getByText('section 2')
            const dataTransfer = new DataTransfer()

            fireEvent.dragStart(dragButton, { dataTransfer })
            fireEvent.drop(targetSectionHeading, { dataTransfer })
            fireEvent.dragEnd(dragButton, { dataTransfer })

            await waitFor(() => {
                const sourceItemField = canvasElement.querySelector(
                    'input[name="sections.0.ingredients.0.item"]',
                ) as HTMLInputElement | null
                const targetItemField = canvasElement.querySelector(
                    'input[name="sections.1.ingredients.0.item"]',
                ) as HTMLInputElement | null

                expect(sourceItemField).not.toBeNull()
                expect(targetItemField).not.toBeNull()
                expect(sourceItemField).toHaveValue('Garlic')
                expect(targetItemField).toHaveValue('Onion')
            })

            await userEvent.click(canvas.getByRole('button', { name: /exit drag and drop mode/i }))

            await waitFor(() => {
                expect(
                    canvas.queryByRole('button', { name: /exit drag and drop mode/i }),
                ).not.toBeInTheDocument()
                expect(canvas.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
            })

            submitCurrentForm(canvasElement)

            await waitFor(() => {
                expect(alertSpy).not.toHaveBeenCalled()
                expect(onNext).toHaveBeenCalledOnce()
                expect(onNext).toHaveBeenCalledWith({
                    sections: [
                        {
                            name: 'Main Recipe',
                            ingredients: [
                                {
                                    quantity: '2',
                                    measure: '',
                                    item: 'Garlic',
                                    preparation: '',
                                },
                            ],
                        },
                        {
                            name: 'section 2',
                            ingredients: [
                                {
                                    quantity: '1',
                                    measure: '',
                                    item: 'Onion',
                                    preparation: '',
                                },
                            ],
                        },
                    ],
                })
            })
        } finally {
            window.alert = originalAlert
        }
    },
}

export const CanLinkIngredientToInternalRecipe: Story = {
    play: async ({ canvas, canvasElement, userEvent }: PlayContext) => {
        onNext.mockClear()

        const textboxes = canvas.getAllByRole('textbox')
        await userEvent.type(textboxes[0], '1')
        await userEvent.type(textboxes[2], 'base curry')
        await userEvent.click(textboxes[2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })

        await userEvent.click(canvas.getByRole('button', { name: /link ingredient/i }))

        await waitFor(() => {
            expect(canvas.getByText('Link Internal Recipe')).toBeInTheDocument()
        })

        const searchInput = canvas.getByRole('textbox', { name: /search recipes/i })
        await userEvent.clear(searchInput)
        await userEvent.type(searchInput, 'base curry')
        await userEvent.click(canvas.getByRole('button', { name: 'Search' }))
        await userEvent.click(canvas.getByRole('button', { name: 'Select' }))

        await waitFor(() => {
            expect(canvas.queryByText('Link Internal Recipe')).not.toBeInTheDocument()
        })

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(onNext).toHaveBeenCalledOnce()
            expect(onNext).toHaveBeenCalledWith({
                sections: [
                    {
                        name: 'Main Recipe',
                        ingredients: [
                            {
                                quantity: '1',
                                measure: '',
                                item: 'base curry',
                                preparation: '',
                                linkedRecipeId: 'd1cbbac8-5b9c-4e7c-9a0b-2c3f1e5a9c3f',
                            },
                        ],
                    },
                ],
            })
        })
    },
}

export const ShowsAlertWhenDraftRowHasUnsubmittedData: Story = {
    play: async ({ canvas, canvasElement, userEvent }: PlayContext) => {
        onNext.mockClear()

        const alertSpy = fn()
        const originalAlert = window.alert
        window.alert = alertSpy

        try {
            const textboxes = canvas.getAllByRole('textbox')
            await userEvent.type(textboxes[0], '2')
            await userEvent.type(textboxes[2], 'Tomatoes')

            submitCurrentForm(canvasElement)

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledOnce()
                expect(alertSpy).toHaveBeenCalledWith(
                    'Please clear the draft row or press Enter to add it before continuing.',
                )
                expect(onNext).not.toHaveBeenCalled()
            })
        } finally {
            window.alert = originalAlert
        }
    },
}

export const CanSubmitOnlyNonDeletedIngredients: Story = {
    play: async ({ canvas, canvasElement, userEvent }: PlayContext) => {
        onNext.mockClear()

        let textboxes = canvas.getAllByRole('textbox')
        let draftRowStartIndex = textboxes.length - 4

        await userEvent.type(textboxes[draftRowStartIndex], '1')
        await userEvent.type(textboxes[draftRowStartIndex + 2], 'Onion')
        await userEvent.click(textboxes[draftRowStartIndex + 2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })

        textboxes = canvas.getAllByRole('textbox')
        draftRowStartIndex = textboxes.length - 4

        await userEvent.type(textboxes[draftRowStartIndex], '2')
        await userEvent.type(textboxes[draftRowStartIndex + 2], 'Garlic')
        await userEvent.click(textboxes[draftRowStartIndex + 2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(12)
        })

        textboxes = canvas.getAllByRole('textbox')
        draftRowStartIndex = textboxes.length - 4

        await userEvent.type(textboxes[draftRowStartIndex], '3')
        await userEvent.type(textboxes[draftRowStartIndex + 2], 'Carrots')
        await userEvent.click(textboxes[draftRowStartIndex + 2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(16)
        })

        const deleteButtons = canvas.getAllByRole('button', { name: /delete ingredient/i })
        await userEvent.click(deleteButtons[1])

        await waitFor(() => {
            expect(canvas.queryByDisplayValue('Garlic')).not.toBeInTheDocument()
            expect(canvas.getAllByRole('textbox')).toHaveLength(12)
        })

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(onNext).toHaveBeenCalledOnce()
            expect(onNext).toHaveBeenCalledWith({
                sections: [
                    {
                        name: 'Main Recipe',
                        ingredients: [
                            {
                                quantity: '1',
                                measure: '',
                                item: 'Onion',
                                preparation: '',
                            },
                            {
                                quantity: '3',
                                measure: '',
                                item: 'Carrots',
                                preparation: '',
                            },
                        ],
                    },
                ],
            })
        })
    },
}
