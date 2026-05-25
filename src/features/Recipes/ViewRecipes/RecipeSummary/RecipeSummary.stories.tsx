import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import RecipeSummary from './RecipeSummary'
import BookRecipe from '@test/mockData/recipes/BookRecipe'
import OnlineRecipe from '@test/mockData/recipes/OnlineRecipe'
import MagazineRecipe from '@test/mockData/recipes/MagazineRecipe'

const meta: Meta<typeof RecipeSummary> = {
    title: 'Features/Recipes/ViewRecipes/RecipeSummary',
    component: RecipeSummary,
    decorators: [
        (Story) => (
            <Box p={4} w="full">
                <Story />
            </Box>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof RecipeSummary>

export const Book: Story = {
    args: {
        title: BookRecipe.title,
        authors: BookRecipe.authors,
        tags: BookRecipe.tags,
        source: BookRecipe.originalSource,
        calories: BookRecipe.calories,
        duration: BookRecipe.duration,
        produces: BookRecipe.produces,
    },
}

export const Online: Story = {
    args: {
        title: OnlineRecipe.title,
        authors: OnlineRecipe.authors,
        tags: OnlineRecipe.tags,
        source: OnlineRecipe.originalSource,
        calories: OnlineRecipe.calories,
        duration: OnlineRecipe.duration,
        produces: OnlineRecipe.produces,
    },
}

export const Magazine: Story = {
    args: {
        title: MagazineRecipe.title,
        authors: MagazineRecipe.authors,
        tags: MagazineRecipe.tags,
        source: MagazineRecipe.originalSource,
        calories: MagazineRecipe.calories,
        duration: MagazineRecipe.duration,
        produces: MagazineRecipe.produces,
    },
}

export const StandingTime: Story = {
    args: {
        title: BookRecipe.title,
        authors: BookRecipe.authors,
        tags: BookRecipe.tags,
        source: BookRecipe.originalSource,
        calories: BookRecipe.calories,
        duration: {
            prepDuration: 20,
            cookingDuration: 40,
            standingTime: 15,
        },
        produces: BookRecipe.produces,
    },
}

export const QuantityProduced: Story = {
    args: {
        title: BookRecipe.title,
        authors: BookRecipe.authors,
        tags: BookRecipe.tags,
        source: BookRecipe.originalSource,
        calories: BookRecipe.calories,
        duration: BookRecipe.duration,
        produces: {
            quantity: 600,
            measure: 'g',
        },
    },
}
