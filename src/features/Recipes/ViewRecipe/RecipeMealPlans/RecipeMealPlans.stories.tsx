import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
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
        dates: ['2026-04-07', '2026-04-09', '2026-04-14', '2026-04-20'],
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
