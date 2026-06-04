import type { Meta, StoryObj } from '@storybook/react-vite'
import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import { expect, fn } from 'storybook/test'
import MockDate from 'mockdate'
import { useEffect } from 'react'
import RecipeMealPlans from './RecipeMealPlans'

const mockingDate = new Date(2026, 4, 31)

function StoryWrapper(args: React.ComponentProps<typeof RecipeMealPlans>) {
    MockDate.set(mockingDate)

    useEffect(() => () => MockDate.reset(), [])

    return <RecipeMealPlans {...args} />
}

const meta: Meta<typeof RecipeMealPlans> = {
    title: 'Features/Recipes/ViewRecipe/RecipeMealPlans',
    component: RecipeMealPlans,
    decorators: [(Story) => <Story />],
    render: (args) => <StoryWrapper {...args} />,
    args: {
        onDateClick: fn(),
    },
}

export default meta
type Story = StoryObj<typeof RecipeMealPlans>

export const NoneSelected: Story = {
    args: {
        dates: [],
    },
}

export const ShowsCurrentAndUpcomingWeeks: Story = {
    args: {
        dates: [
            {
                date: '2026-05-26',
                mealTime: MealTime.DINNER,
                course: Course.MAIN,
            },
            {
                date: '2026-05-28',
                mealTime: MealTime.LUNCH,
                course: Course.SIDE,
            },
            {
                date: '2026-06-01',
                mealTime: MealTime.DINNER,
                course: Course.MAIN,
            },
            {
                date: '2026-06-09',
                mealTime: MealTime.LUNCH,
                course: Course.STARTER,
            },
        ],
    },
    play: async ({ canvas }) => {
        expect(canvas.getByText(/monday/i).closest('[data-status]')).toHaveAttribute(
            'data-status',
            'subtle',
        )
        expect(canvas.getByText(/tuesday/i).closest('[data-status]')).toHaveAttribute(
            'data-status',
            'highlighted',
        )
        expect(canvas.getByText(/wednesday/i).closest('[data-status]')).toHaveAttribute(
            'data-status',
            'default',
        )
        expect(canvas.getByText(/thursday/i).closest('[data-status]')).toHaveAttribute(
            'data-status',
            'highlighted',
        )
        expect(canvas.getByText(/friday/i).closest('[data-status]')).toHaveAttribute(
            'data-status',
            'default',
        )
        expect(canvas.getByText(/saturday/i).closest('[data-status]')).toHaveAttribute(
            'data-status',
            'default',
        )
        expect(canvas.getByText(/sunday/i).closest('[data-status]')).toHaveAttribute(
            'data-status',
            'default',
        )
    },
}
