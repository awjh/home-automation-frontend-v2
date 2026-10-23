import type { Meta, StoryObj } from '@storybook/react-vite'
import MockBellboards from '@test/mockData/bellboards/MockBellboards'
import { expect, fn } from 'storybook/test'
import BellboardsScreen from './BellboardsScreen'

const meta: Meta<typeof BellboardsScreen> = {
    title: 'Screens/BellboardsScreen',
    component: BellboardsScreen,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        bellboards: MockBellboards,
        ringBellboard: fn(async () => ({ eventId: '0b6f5f5e-8a8f-4c1e-9f3b-2a1d6e7c8b9a' })),
    },
}

export default meta
type Story = StoryObj<typeof BellboardsScreen>

export const Default: Story = {
    play: async ({ canvas }) => {
        expect(canvas.getByRole('link', { name: 'bellboards' })).toHaveAttribute(
            'href',
            '/bellboards',
        )

        for (const bellboard of MockBellboards) {
            expect(canvas.getByRole('button', { name: bellboard.bellboardName })).toBeVisible()
        }
    },
}
