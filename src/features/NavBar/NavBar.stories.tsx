import type { Meta, StoryObj } from '@storybook/react-vite'
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
