import type { Meta, StoryObj } from '@storybook/react'
import PasswordReset from './page'

const meta: Meta<typeof PasswordReset> = {
    title: 'Pages/PasswordReset',
    component: PasswordReset,
    decorators: [(Story) => <Story />],
    args: {},
}

export default meta
type Story = StoryObj<typeof PasswordReset>

export const Default: Story = {}
