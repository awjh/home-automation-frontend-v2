import type { Meta, StoryObj } from '@storybook/react-vite'
import PasswordReset from './PasswordReset'

const meta: Meta<typeof PasswordReset> = {
    title: 'Features/PasswordReset/PasswordResetForm',
    component: PasswordReset,
    decorators: [(Story) => <Story />],
    args: {
        onSubmit: (password: string) => alert(`Password submitted: ${password}`),
    },
}

export default meta
type Story = StoryObj<typeof PasswordReset>

export const Default: Story = {}
