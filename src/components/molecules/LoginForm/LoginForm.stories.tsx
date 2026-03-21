import type { Meta, StoryObj } from '@storybook/react-vite'
import LoginForm from './LoginForm'

const meta: Meta<typeof LoginForm> = {
    title: 'Molecules/LoginForm',
    component: LoginForm,
    decorators: [(Story) => <Story />],
    args: {},
}

export default meta
type Story = StoryObj<typeof LoginForm>

export const Default: Story = {}
