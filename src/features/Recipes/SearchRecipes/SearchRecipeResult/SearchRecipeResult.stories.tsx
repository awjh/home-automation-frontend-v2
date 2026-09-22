import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import BookRecipe from '@test/mockData/recipes/BookRecipe'
import SearchRecipeResult from './SearchRecipeResult'

const meta: Meta<typeof SearchRecipeResult> = {
    title: 'Features/Recipes/SearchRecipes/SearchRecipeResult',
    component: SearchRecipeResult,
    decorators: [
        (Story) => (
            <Box maxW="900px" p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        colorStyle: 'primary',
        recipe: { ...BookRecipe, image: '/recipe.jpg' },
    },
}

export default meta
type Story = StoryObj<typeof SearchRecipeResult>

export const Primary: Story = {}

export const Subtle: Story = {
    args: {
        colorStyle: 'subtle',
    },
}

export const PrimaryNoImage: Story = {
    args: {
        recipe: { ...BookRecipe, image: undefined },
    },
}

export const SubtleNoImage: Story = {
    args: {
        colorStyle: 'subtle',
        recipe: { ...BookRecipe, image: undefined },
    },
}
