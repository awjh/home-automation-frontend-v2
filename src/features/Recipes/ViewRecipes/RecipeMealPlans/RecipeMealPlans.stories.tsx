import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import MockDate from 'mockdate'
import RecipeMealPlans from './RecipeMealPlans'

const mockingDate = new Date(2026, 3, 7)

const meta: Meta<typeof RecipeMealPlans> = {
    title: 'Features/Recipes/ViewRecipes/RecipeMealPlans',
    component: RecipeMealPlans,
    decorators: [(Story) => <Story />],
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
    play: async ({ canvas, mount }) => {
        MockDate.set(mockingDate)
        await mount()

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
        MockDate.reset()
    },
}
