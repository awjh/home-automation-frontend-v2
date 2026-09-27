import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import IngredientsList from './IngredientsList'

const meta: Meta<typeof IngredientsList> = {
    title: 'Features/Recipes/ViewRecipe/IngredientsList',
    component: IngredientsList,
    decorators: [
        (Story) => (
            <Box maxW="360px" p={4} w="full">
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
type Story = StoryObj<typeof IngredientsList>

export const Default: Story = {}

export const FractionalQuantities: Story = {
    args: {
        ingredients: [
            { item: 'Butter', quantity: 0.5, measure: 'tbsp' },
            { item: 'Chilli flakes', quantity: 0.33, measure: 'tsp' },
            { item: 'Milk', quantity: 1.666, measure: 'cups' },
            { item: 'Flour', quantity: 2.25, measure: 'cups' },
            { item: 'Salt', quantity: 0.125, measure: 'tsp' },
            { item: 'Lemon juice', quantity: 0.3, measure: 'tbsp' },
            { item: 'Olive oil', quantity: 1.2, measure: 'tbsp' },
        ],
    },
    play: async ({ canvasElement }) => {
        const quantities = within(canvasElement)
            .getAllByTestId('quantity')
            .map((quantity) => quantity.textContent)

        await expect(quantities).toEqual([
            '1/2 tbsp',
            '1/3 tsp',
            '12/3 cups',
            '21/4 cups',
            '1/8 tsp',
            // Not close enough to a fraction so left as decimals
            '0.3 tbsp',
            '1.2 tbsp',
        ])
    },
}
