import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecordSearchResult from '@test/mockData/records/MockRecordSearchResult'
import {
    MockRecordSearchFilters,
    MockRecordSearchTags,
} from '@test/mockData/records/MockRecordSearchOptions'
import { fn } from 'storybook/test'
import SearchRecordScreen from './SearchRecordScreen'

const meta: Meta<typeof SearchRecordScreen> = {
    title: 'Screens/SearchRecordScreen',
    component: SearchRecordScreen,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        tags: MockRecordSearchTags,
        filters: MockRecordSearchFilters,
        records: [
            MockRecordSearchResult,
            { ...MockRecordSearchResult, id: 'record-2', title: 'Tusk', image: undefined },
        ],
        loadNextRecordsPage: fn(),
    },
}

export default meta
type Story = StoryObj<typeof SearchRecordScreen>

export const Default: Story = {}
