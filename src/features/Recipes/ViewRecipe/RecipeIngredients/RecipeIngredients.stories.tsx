import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockBaseRecipe from '@test/mockData/recipes/shared/MockBaseRecipe'
import RecipeIngredients from './RecipeIngredients'

const meta: Meta<typeof RecipeIngredients> = {
    title: 'Features/Recipes/ViewRecipe/RecipeIngredients',
    component: RecipeIngredients,
    decorators: [
        (Story) => (
            <Box maxW="450px" p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        ingredients: MockBaseRecipe.ingredients,
    },
}

export default meta
type Story = StoryObj<typeof RecipeIngredients>

export const Default: Story = {}

export const SingleSection: Story = {
    args: {
        ingredients: [MockBaseRecipe.ingredients[0]],
    },
}
