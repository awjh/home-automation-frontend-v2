import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import BookRecipe from '@test/mockData/recipes/BookRecipe'
import MagazineRecipe from '@test/mockData/recipes/MagazineRecipe'
import OnlineRecipe from '@test/mockData/recipes/OnlineRecipe'
import SearchRecipeResults from './SearchRecipeResults'

const recipeList = [
    { ...BookRecipe, image: '/recipe.jpg' },
    { ...OnlineRecipe, image: '/recipe.jpg' },
    MagazineRecipe,
    {
        ...BookRecipe,
        id: 'recipe-4',
        title: 'Lemon Chicken Tray Bake',
        authors: ['Alex Green'],
    },
]

const meta: Meta<typeof SearchRecipeResults> = {
    title: 'Features/Recipes/SearchRecipes/SearchRecipeResults',
    component: SearchRecipeResults,
    decorators: [
        (Story) => (
            <Box p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        recipes: recipeList,
    },
}

export default meta
type Story = StoryObj<typeof SearchRecipeResults>

export const Default: Story = {}

export const WithLoadMore: Story = {
    args: {
        onLoadNextPage: fn(),
    },
}

export const LoadingNextPage: Story = {
    args: {
        onLoadNextPage: fn(),
        isLoadingNextPage: true,
    },
}
