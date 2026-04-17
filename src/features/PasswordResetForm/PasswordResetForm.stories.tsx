import type { Meta, StoryObj } from '@storybook/react-vite'
import PasswordResetForm from './PasswordResetForm'

const meta: Meta<typeof PasswordResetForm> = {
    title: 'Features/PasswordReset/PasswordResetForm',
    component: PasswordResetForm,
    decorators: [(Story) => <Story />],
    args: {
        onSubmit: (password: string) => alert(`Password submitted: ${password}`),
    },
}

export default meta
type Story = StoryObj<typeof PasswordResetForm>

export const Default: Story = {}
