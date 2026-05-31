import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import BookRecipe from '@test/mockData/recipes/BookRecipe'
import RecipeMethod from './RecipeMethod'

const meta: Meta<typeof RecipeMethod> = {
    title: 'Features/Recipes/ViewRecipe/RecipeMethod',
    component: RecipeMethod,
    decorators: [
        (Story) => (
            <Box p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        method: BookRecipe.method,
    },
}

export default meta
type Story = StoryObj<typeof RecipeMethod>

export const Default: Story = {}