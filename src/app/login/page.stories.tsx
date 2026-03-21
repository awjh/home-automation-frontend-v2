import type { Meta, StoryObj } from '@storybook/react-vite'
import Login from './page'

const meta: Meta<typeof Login> = {
    title: 'Pages/Login',
    component: Login,
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
type Story = StoryObj<typeof Login>

export const Default: Story = {}
