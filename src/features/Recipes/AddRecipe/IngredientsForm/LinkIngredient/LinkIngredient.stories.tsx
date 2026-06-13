import { Box, Text, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { useForm, useWatch } from 'react-hook-form'
import searchRecipes from '@test/storybookHelpers/searchRecipes'
import LinkIngredient from './LinkIngredient'
import {
    createEmptyIngredient,
    type IngredientsFormValues,
} from '../IngredientsSectionForm/IngredientsSectionForm'

interface LinkIngredientStoryProps {
    initialLinkedRecipeId?: string
    initialItem?: string
}

function LinkIngredientStory({
    initialLinkedRecipeId,
    initialItem = 'Spaghetti',
}: LinkIngredientStoryProps) {
    const { control, setValue } = useForm<IngredientsFormValues>({
        defaultValues: {
            sections: [
                {
                    name: 'section 1',
                    ingredients: [
                        {
                            ...createEmptyIngredient(),
                            item: initialItem,
                            linkedRecipeId: initialLinkedRecipeId,
                        },
                    ],
                },
            ],
        },
        mode: 'onTouched',
    })

    const watchedIngredients = useWatch({
        control,
        name: 'sections.0.ingredients',
    })
    const linkedRecipeId = watchedIngredients?.[0]?.linkedRecipeId

    return (
        <VStack alignItems={'start'}>
            <LinkIngredient
                control={control}
                ingredientsPath={'sections.0.ingredients'}
                rowIndex={0}
                sectionIndex={0}
                hasLinkedRecipe={!!linkedRecipeId}
                searchInternalRecipes={searchRecipes}
                setValue={setValue}
            />
            <Text data-testid={'linked-recipe-id'}>{linkedRecipeId ?? 'none'}</Text>
        </VStack>
    )
}

const meta: Meta<typeof LinkIngredientStory> = {
    title: 'Features/Recipes/AddRecipe/IngredientsForm/LinkIngredient',
    component: LinkIngredientStory,
    decorators: [
        (Story) => (
            <Box p={4} minH={'300px'}>
                <Story />
            </Box>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CanLinkRecipe: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /link ingredient/i }))

        await waitFor(() => {
            expect(canvas.getByText('Link Internal Recipe')).toBeInTheDocument()
        })

        const searchInput = canvas.getByRole('textbox', { name: /search recipes/i })

        await userEvent.clear(searchInput)
        await userEvent.type(searchInput, 'spag')
        await userEvent.click(canvas.getByRole('button', { name: 'Search' }))
        await userEvent.click(canvas.getAllByRole('button', { name: 'Select' })[0])

        await waitFor(() => {
            expect(canvas.queryByText('Link Internal Recipe')).not.toBeInTheDocument()
            expect(canvas.getByTestId('linked-recipe-id')).not.toHaveTextContent('none')
        })
    },
}

export const CanUnlinkRecipe: Story = {
    args: {
        initialLinkedRecipeId: 'e5f2a38d-3e4d-4d07-8de0-5ff7f0972b01',
    },
    play: async ({ canvas, userEvent }) => {
        expect(canvas.getByTestId('linked-recipe-id')).toHaveTextContent(
            'e5f2a38d-3e4d-4d07-8de0-5ff7f0972b01',
        )

        await userEvent.click(canvas.getByRole('button', { name: /link ingredient/i }))

        await waitFor(() => {
            expect(canvas.getByTestId('linked-recipe-id')).toHaveTextContent('none')
        })
    },
}
