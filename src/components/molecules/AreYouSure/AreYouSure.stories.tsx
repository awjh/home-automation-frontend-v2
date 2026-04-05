import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import AreYouSure from './AreYouSure'

const meta: Meta<typeof AreYouSure> = {
    title: 'Molecules/AreYouSure',
    component: AreYouSure,
    decorators: [(Story) => <Story />],
    args: {
        title: 'Do an action',
        message: 'Are you sure you wish to perform this action? This cannot be undone.',
        onConfirm: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AreYouSure>

export const Default: Story = {}
