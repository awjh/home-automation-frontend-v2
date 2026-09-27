import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import OriginalSource from './OriginalSource'
import BookRecipe from '@test/mockData/recipes/BookRecipe'
import MagazineRecipe from '@test/mockData/recipes/MagazineRecipe'
import OnlineRecipe from '@test/mockData/recipes/OnlineRecipe'

const meta: Meta<typeof OriginalSource> = {
    title: 'Features/Recipes/ViewRecipe/OriginalSource',
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

export const LegacyOnline: Story = {
    args: {
        source: {
            type: SourceType.ONLINE,
            url: 'https://home-automation.andrewhurt.co.uk/recipes/legacy-recipes/chicken-pie',
        },
    },
    play: async ({ canvasElement }) => {
        await expect(canvasElement.querySelector('a')).toBeNull()
    },
}
