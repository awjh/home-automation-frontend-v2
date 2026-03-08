import type { Meta, StoryObj } from '@storybook/react'
import Button from './Button'

const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    decorators: [(Story) => <Story />],
    args: {
        children: 'Example button',
    },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const Primary: Story = {
    args: {
        colorStyle: 'primary',
    },
}

export const Secondary: Story = {
    args: {
        colorStyle: 'secondary',
    },
}
