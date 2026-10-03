import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import { expect } from 'storybook/test'
import RecordDetails from './RecordDetails'

const meta: Meta<typeof RecordDetails> = {
    title: 'Features/Records/ViewRecord/RecordDetails',
    component: RecordDetails,
    decorators: [
        (Story) => (
            <Box p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        labels: MockRecord.labels,
        catNo: MockRecord.catNo,
        year: MockRecord.year,
    },
}

export default meta
type Story = StoryObj<typeof RecordDetails>

export const SingleLabel: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByTestId('record-details')).toHaveTextContent(
            'Warner Bros. Records · K 56344 · 1977',
        )
    },
}

export const MultipleLabels: Story = {
    args: {
        labels: ['Rough Trade', 'Matador'],
        catNo: 'RTRADLP 123',
        year: 2004,
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByTestId('record-details')).toHaveTextContent(
            'Rough Trade, Matador · RTRADLP 123 · 2004',
        )
    },
}

export const NarrowWidth: Story = {
    decorators: [
        (Story) => (
            <Box p={4} w="200px">
                <Story />
            </Box>
        ),
    ],
    args: {
        labels: ['Parlophone Records Limited', 'Columbia Records'],
    },
}
