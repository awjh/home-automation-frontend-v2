import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import { expect } from 'storybook/test'
import TrackList from './TrackList'

const meta: Meta<typeof TrackList> = {
    title: 'Features/Records/ViewRecord/TrackList',
    component: TrackList,
    decorators: [
        (Story) => (
            <Box maxW="360px" p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        songs: MockRecord.sides[0].songs,
    },
}

export default meta
type Story = StoryObj<typeof TrackList>

export const Default: Story = {}

export const ZeroPadsDurations: Story = {
    args: {
        songs: [
            { title: 'Short', duration: 5 },
            { title: 'Minute', duration: 60 },
            { title: 'Long', duration: 754 },
        ],
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText('1. Short')).toBeInTheDocument()
        await expect(canvas.getByText('00:05')).toBeInTheDocument()
        await expect(canvas.getByText('01:00')).toBeInTheDocument()
        await expect(canvas.getByText('12:34')).toBeInTheDocument()
    },
}
