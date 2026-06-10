import { expect, fn, waitFor } from 'storybook/test'
import IngredientsForm from './IngredientsForm'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@chakra-ui/react'

const onNext = fn()
const onBack = fn()

const meta: Meta<typeof IngredientsForm> = {
    title: 'Features/AddRecipe/IngredientsForm',
    component: IngredientsForm,
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
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

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

export const CanSubmitWithIngredients: Story = {
    play: async ({ canvas, userEvent }: PlayContext) => {
        onNext.mockClear()

        const textboxes = canvas.getAllByRole('textbox')
        await userEvent.type(textboxes[0], '2')
        await userEvent.type(textboxes[2], 'Tomatoes')
        await userEvent.click(textboxes[2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

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
    play: async ({ canvas, userEvent }: PlayContext) => {
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

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

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
