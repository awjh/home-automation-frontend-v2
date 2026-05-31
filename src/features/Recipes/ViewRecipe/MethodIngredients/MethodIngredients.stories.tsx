import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MethodIngredients from './MethodIngredients'

const meta: Meta<typeof MethodIngredients> = {
    title: 'Features/Recipes/ViewRecipe/MethodIngredients',
    component: MethodIngredients,
    decorators: [
        (Story) => (
            <Box maxW="450px" p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        ingredients: [
            { item: 'Chicken breasts', quantity: 2 },
            { item: 'Leeks', preparation: 'finely sliced', quantity: 3 },
            {
                item: 'Puff pastry',
                preparation: 'rolled to 30cm in diameter and lightly floured',
                quantity: 1,
            },
            { item: 'Double cream', quantity: 100, measure: 'ml' },
        ],
    },
}

export default meta
type Story = StoryObj<typeof MethodIngredients>

export const Default: Story = {}
