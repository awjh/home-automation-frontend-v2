import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MethodStep from './MethodStep'

const meta: Meta<typeof MethodStep> = {
    title: 'Features/Recipes/ViewRecipes/MethodStep',
    component: MethodStep,
    decorators: [
        (Story) => (
            <Box p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        method: 'Preheat the oven to 200C. Place the chicken breasts and leeks in a roasting tin and drizzle with olive oil. Roast for 20 minutes until the chicken is cooked through.',
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
type Story = StoryObj<typeof MethodStep>

export const Default: Story = {}
