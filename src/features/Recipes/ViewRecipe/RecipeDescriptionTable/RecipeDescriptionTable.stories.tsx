import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import BookRecipe from '@test/mockData/recipes/BookRecipe'
import RecipeDescriptionTable from './RecipeDescriptionTable'

const meta: Meta<typeof RecipeDescriptionTable> = {
    title: 'Features/Recipes/ViewRecipe/RecipeDescriptionTable',
    component: RecipeDescriptionTable,
    decorators: [
        (Story) => (
            <Box p={4} w="full">
                <Story />
            </Box>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof RecipeDescriptionTable>

const servesRecipe = {
    calories: BookRecipe.calories,
    duration: BookRecipe.duration,
    produces: BookRecipe.produces,
}

const producesRecipe = {
    calories: BookRecipe.calories,
    duration: BookRecipe.duration,
    produces: {
        quantity: 600,
        measure: 'g',
    },
}

const noStandingTimeRecipe = {
    calories: BookRecipe.calories,
    duration: {
        prepDuration: 15,
        cookingDuration: 45,
        standingTime: 0,
    },
    produces: BookRecipe.produces,
}

const standingTimeRecipe = {
    calories: BookRecipe.calories,
    duration: {
        prepDuration: 20,
        cookingDuration: 40,
        standingTime: 15,
    },
    produces: BookRecipe.produces,
}

export const Serves: Story = {
    args: {
        recipe: servesRecipe,
    },
}

export const Produces: Story = {
    args: {
        recipe: producesRecipe,
    },
}

export const NoStandingTime: Story = {
    args: {
        recipe: noStandingTimeRecipe,
    },
}

export const StandingTime: Story = {
    args: {
        recipe: standingTimeRecipe,
    },
}
