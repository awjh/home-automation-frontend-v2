import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import Method from './Method'

const meta: Meta<typeof Method> = {
    title: 'Features/Recipes/ViewRecipes/Method',
    component: Method,
    decorators: [
        (Story) => (
            <Box p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        steps: [
            {
                method: 'Preheat the oven to 200C.',
                ingredients: [],
            },
            {
                method: 'Place the chicken breasts and leeks in a roasting tin and drizzle with olive oil. Roast for 20 minutes until the chicken is cooked through.',
                ingredients: [
                    { item: 'Chicken breasts', quantity: 2 },
                    { item: 'Leeks', preparation: 'finely sliced', quantity: 3 },
                ],
            },
            {
                method: 'Remove from oven and leave to cool. Stir in the double cream.',
                ingredients: [{ item: 'Double cream', quantity: 100, measure: 'ml' }],
            },
            {
                method: 'Place the chicken mixture in the centre of the pastry and fold the pastry over to enclose. Brush with beaten egg and bake for 25 minutes until golden.',
                ingredients: [
                    {
                        item: 'Puff pastry',
                        preparation: 'rolled to 30cm in diameter and lightly floured',
                        quantity: 1,
                    },
                ],
            },
        ],
    },
}

export default meta
type Story = StoryObj<typeof Method>

export const Default: Story = {}
