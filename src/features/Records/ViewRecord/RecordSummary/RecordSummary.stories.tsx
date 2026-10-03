import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import { expect } from 'storybook/test'
import RecordSummary from './RecordSummary'

const meta: Meta<typeof RecordSummary> = {
    title: 'Features/Records/ViewRecord/RecordSummary',
    component: RecordSummary,
    args: MockRecord,
}

export default meta
type Story = StoryObj<typeof RecordSummary>

export const Default: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByText('rock')).toBeInTheDocument()
        await expect(canvas.getByText('black')).toBeInTheDocument()
        await expect(canvas.getByText('K 56344')).toBeInTheDocument()
    },
}

export const MultipleArtists: Story = {
    args: {
        title: 'Watch the Throne',
        artists: ['Jay-Z', 'Kanye West'],
    },
}
