import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecordSearchResult from '@test/mockData/records/MockRecordSearchResult'
import { expect, fn } from 'storybook/test'
import SearchRecordResults from './SearchRecordResults'

const records = [
    MockRecordSearchResult,
    { ...MockRecordSearchResult, id: 'record-2', title: 'Tusk', image: undefined },
    { ...MockRecordSearchResult, id: 'record-3', title: 'Mirage' },
]

const meta: Meta<typeof SearchRecordResults> = {
    title: 'Features/Records/SearchRecords/SearchRecordResults',
    component: SearchRecordResults,
    args: {
        records,
    },
}

export default meta
type Story = StoryObj<typeof SearchRecordResults>

export const Default: Story = {
    play: async ({ canvas }) => {
        expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(3)
        expect(canvas.queryByRole('button', { name: /^load more$/i })).not.toBeInTheDocument()
    },
}

export const WithLoadMore: Story = {
    args: {
        onLoadNextPage: fn(),
    },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /^load more$/i }))

        expect(args.onLoadNextPage).toHaveBeenCalled()
    },
}

export const Empty: Story = {
    args: {
        records: [],
        onLoadNextPage: fn(),
    },
    play: async ({ canvas }) => {
        expect(canvas.queryByRole('button', { name: /^load more$/i })).not.toBeInTheDocument()
    },
}
