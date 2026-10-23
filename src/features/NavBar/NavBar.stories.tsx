import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import NavBar from './NavBar'

const meta: Meta<typeof NavBar> = {
    title: 'Features/NavBar/NavBar',
    component: NavBar,
    decorators: [(Story) => <Story />],
    args: {},
}

export default meta
type Story = StoryObj<typeof NavBar>

export const Default: Story = {}

export const LinksToBellboards: Story = {
    play: async ({ canvas }) => {
        expect(canvas.getByRole('link', { name: 'bellboards' })).toHaveAttribute(
            'href',
            '/bellboards',
        )
    },
}
