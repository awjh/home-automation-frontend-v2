import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import MockExternalRecords from '@test/mockData/records/MockExternalRecords'
import MockRecordLookup from '@test/mockData/records/MockRecordLookup'
import { fn } from 'storybook/test'
import AddRecordScreen from './AddRecordScreen'

const meta: Meta<typeof AddRecordScreen> = {
    title: 'Screens/AddRecordScreen',
    component: AddRecordScreen,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        searchExternalRecords: fn(async () => MockExternalRecords),
        getExternalRecord: fn(async () => MockRecordLookup),
        addRecord: fn(async () => ({ id: '3f1c2b8e-5d4a-4c6b-9e7f-1a2b3c4d5e6f' })),
        uploadRecordImage: fn(async () => ({ key: 'uploaded-image-key' })),
    },
}

export default meta

type Story = StoryObj<typeof AddRecordScreen>

export const Default: Story = {}

export const Edit: Story = {
    args: {
        record: MockRecord,
        editRecord: fn(async () => ({ id: MockRecord.id })),
        addRecord: undefined,
        uploadRecordImage: undefined,
    },
}
