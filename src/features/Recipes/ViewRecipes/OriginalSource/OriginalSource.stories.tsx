import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import OriginalSource from './OriginalSource'
import BookRecipe from '@test/mockData/recipes/BookRecipe'
import MagazineRecipe from '@test/mockData/recipes/MagazineRecipe'
import OnlineRecipe from '@test/mockData/recipes/OnlineRecipe'

const meta: Meta<typeof OriginalSource> = {
    title: 'Features/Recipes/ViewRecipes/OriginalSource',
    component: OriginalSource,
    decorators: [
        (Story) => (
            <Box p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        source: BookRecipe.originalSource,
    },
}

export default meta
type Story = StoryObj<typeof OriginalSource>

export const Book: Story = {
    args: {
        source: BookRecipe.originalSource,
    },
}

export const Magazine: Story = {
    args: {
        source: MagazineRecipe.originalSource,
    },
}

export const Online: Story = {
    args: {
        source: OnlineRecipe.originalSource,
    },
}
