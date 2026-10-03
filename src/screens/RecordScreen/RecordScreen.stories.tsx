import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import RecordScreen from './RecordScreen'

const meta: Meta<typeof RecordScreen> = {
    title: 'Screens/RecordScreen',
    component: RecordScreen,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        record: MockRecord,
    },
}

export default meta

type Story = StoryObj<typeof RecordScreen>

export const Default: Story = {}
