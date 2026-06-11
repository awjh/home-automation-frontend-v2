import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import IngredientsSectionForm, {
    createEmptyIngredient,
    type IngredientsFormValues,
} from './IngredientsSectionForm'
import searchRecipes from '@test/storybookHelpers/searchRecipes'

function IngredientsSectionFormStory() {
    const { clearErrors, control, setError, setFocus, setValue } = useForm<IngredientsFormValues>({
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
        <IngredientsSectionForm
            control={control}
            clearErrors={clearErrors}
            sectionIndex={0}
            sectionCount={1}
            onDeleteSection={() => {}}
            setError={setError}
            setValue={setValue}
            setFocus={setFocus}
            searchInternalRecipes={searchRecipes}
        />
    )
}

const meta: Meta<typeof IngredientsSectionFormStory> = {
    title: 'Features/AddRecipe/IngredientsForm/IngredientsSectionForm',
    component: IngredientsSectionFormStory,
    decorators: [
        (Story) => (
            <Box p={4}>
                <Story />
            </Box>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CanAddIngredientRowWithEnter: Story = {
    play: async ({ canvas, userEvent }) => {
        const textboxes = canvas.getAllByRole('textbox')

        await userEvent.type(textboxes[0], '2')
        await userEvent.type(textboxes[2], 'Tomatoes')
        await userEvent.click(textboxes[2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })
    },
}

export const CanDeleteIngredientRow: Story = {
    play: async ({ canvas, userEvent }) => {
        const initialTextboxes = canvas.getAllByRole('textbox')

        await userEvent.type(initialTextboxes[0], '2')
        await userEvent.type(initialTextboxes[2], 'Tomatoes')
        await userEvent.click(initialTextboxes[2])
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(8)
        })

        await userEvent.click(canvas.getByRole('button', { name: /delete ingredient/i }))

        await waitFor(() => {
            expect(canvas.getAllByRole('textbox')).toHaveLength(4)
        })
    },
}

export const CanChangeSectionTitle: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByText('section 1'))

        const titleInput = canvas.getByDisplayValue('section 1')

        await userEvent.clear(titleInput)
        await userEvent.type(titleInput, 'Breakfast')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(canvas.getByText('Breakfast')).toBeInTheDocument()
        })
    },
}
