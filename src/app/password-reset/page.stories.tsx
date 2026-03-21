import type { Meta, StoryObj } from '@storybook/react-vite'
import PasswordReset from './page'

const meta: Meta<typeof PasswordReset> = {
    title: 'Pages/PasswordReset',
    component: PasswordReset,
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                push: () => {},
            },
        },
    },
    decorators: [(Story) => <Story />],
    args: {},
}

export default meta
type Story = StoryObj<typeof PasswordReset>

export const Default: Story = {}
