import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import IngredientsSectionTitle from './IngredientsSectionTitle'
import {
    createEmptyIngredient,
    type IngredientsFormValues,
} from '../IngredientsSectionForm/IngredientsSectionForm'

function IngredientsSectionTitleStory({
    canDeleteSection = false,
    onDeleteSection,
}: {
    canDeleteSection?: boolean
    onDeleteSection: ReturnType<typeof fn>
}) {
    const { control, setValue } = useForm<IngredientsFormValues>({
        defaultValues: {
            sections: [
                {
                    name: 'section 1',
                    ingredients: [createEmptyIngredient()],
                },
            ],
        },
        mode: 'onTouched',
    })

    return (
        <IngredientsSectionTitle
            control={control}
            sectionIndex={0}
            setValue={setValue}
            canDeleteSection={canDeleteSection}
            onDeleteSection={onDeleteSection}
        />
    )
}

const meta: Meta<typeof IngredientsSectionTitleStory> = {
    title: 'Features/Recipes/AddRecipe/AddRecipeForm/steps/IngredientsForm/IngredientsSectionTitle',
    component: IngredientsSectionTitleStory,
    decorators: [
        (Story) => (
            <Box p={4} maxW={'400px'}>
                <Story />
            </Box>
        ),
    ],
    args: {
        onDeleteSection: fn(),
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const ConfirmWithButton: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByText('section 1'))

        const input = canvas.getByRole('textbox')

        await userEvent.clear(input)
        await userEvent.type(input, 'Breakfast')
        await userEvent.click(canvas.getByRole('button', { name: /confirm section title change/i }))

        await waitFor(() => {
            expect(canvas.getByText('Breakfast')).toBeInTheDocument()
        })
    },
}

export const ConfirmWithEnter: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByText('section 1'))

        const input = canvas.getByRole('textbox')

        await userEvent.clear(input)
        await userEvent.type(input, 'Lunch')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getByText('Lunch')).toBeInTheDocument()
        })
    },
}

export const RevertWithButton: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByText('section 1'))

        const input = canvas.getByRole('textbox')

        await userEvent.clear(input)
        await userEvent.type(input, 'Dinner')
        await userEvent.click(canvas.getByRole('button', { name: /revert section title change/i }))

        await waitFor(() => {
            expect(canvas.getByText('section 1')).toBeInTheDocument()
        })
    },
}

export const DeleteCallsCallback: Story = {
    args: {
        canDeleteSection: true,
    },
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getByRole('button', { name: /delete section/i }))

        await waitFor(() => {
            expect(args.onDeleteSection).toHaveBeenCalledOnce()
        })
    },
}
