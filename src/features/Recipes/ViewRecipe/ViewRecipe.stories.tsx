import type { Meta, StoryObj } from '@storybook/react-vite'
import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import { expect, fn, waitFor } from 'storybook/test'
import MockDate from 'mockdate'
import OnlineRecipe from '@test/mockData/recipes/OnlineRecipe'
import { useEffect } from 'react'
import ViewRecipe from './ViewRecipe'

const mockingDate = new Date(2026, 4, 31)

function StoryWrapper(args: React.ComponentProps<typeof ViewRecipe>) {
    MockDate.set(mockingDate)

    useEffect(() => () => MockDate.reset(), [])

    return <ViewRecipe {...args} />
}

const meta: Meta<typeof ViewRecipe> = {
    title: 'Features/Recipes/ViewRecipe',
    component: ViewRecipe,
    decorators: [(Story) => <Story />],
    render: (args) => <StoryWrapper {...args} />,
    args: {
        recipe: {
            ...OnlineRecipe,
            image: '/recipe.jpg',
        },
        dates: [
            {
                date: '2026-06-02',
                mealTime: MealTime.DINNER,
                course: Course.MAIN,
            },
            {
                date: '2026-06-09',
                mealTime: MealTime.LUNCH,
                course: Course.SIDE,
            },
        ],
        onDateClick: fn(),
    },
}

export default meta
type Story = StoryObj<typeof ViewRecipe>

export const Default: Story = {}

export const SwitchesVisibleRecipeSectionOnSmallScreens: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    globals: {
        viewport: {
            value: 'mobile1',
            isRotated: false,
        },
    },
    play: async ({ canvas, canvasElement, userEvent }) => {
        const ingredientsPanel = canvasElement.querySelector('[data-active-tab="Ingredients"]')

        if (!(ingredientsPanel instanceof HTMLElement)) {
            throw new Error('Active ingredients tab panel could not be found.')
        }

        expect(ingredientsPanel).toHaveTextContent(/for the bolognese/i)
        expect(ingredientsPanel).not.toHaveTextContent(/heat the olive oil in a large saucepan/i)

        await waitFor(() => {
            expect(canvas.queryByRole('button', { name: /^method$/i })).not.toBeNull()
        })

        await userEvent.click(canvas.getByRole('button', { name: /^method$/i }))

        const methodPanel = canvasElement.querySelector('[data-active-tab="Method"]')

        if (!(methodPanel instanceof HTMLElement)) {
            throw new Error('Active method tab panel could not be found.')
        }

        expect(methodPanel).toHaveTextContent(/heat the olive oil in a large saucepan/i)
        expect(methodPanel).not.toHaveTextContent(/for the bolognese/i)
    },
}
