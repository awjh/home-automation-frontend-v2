import type { Meta, StoryObj } from '@storybook/react'
import PasswordResetForm from './PasswordResetForm'

const meta: Meta<typeof PasswordResetForm> = {
    title: 'Organisms/PasswordResetForm',
    component: PasswordResetForm,
    decorators: [(Story) => <Story />],
    args: {
        onSubmit: (password: string) => alert(`Password submitted: ${password}`),
    },
}

export default meta
type Story = StoryObj<typeof PasswordResetForm>

export const Default: Story = {}
