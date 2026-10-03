import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import { expect } from 'storybook/test'
import RecordTracks from './RecordTracks'

const meta: Meta<typeof RecordTracks> = {
    title: 'Features/Records/ViewRecord/RecordTracks',
    component: RecordTracks,
    decorators: [
        (Story) => (
            <Box maxW="450px" p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        sides: MockRecord.sides,
    },
}

export default meta
type Story = StoryObj<typeof RecordTracks>

export const Default: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('heading', { name: 'Side A' })).toBeInTheDocument()
        await expect(canvas.getByRole('heading', { name: 'Side B' })).toBeInTheDocument()
    },
}
