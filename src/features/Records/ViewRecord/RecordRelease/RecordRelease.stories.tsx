import { RecordFormat, ReleaseType } from '@awjh/home-automation-v2-api-models/records'
import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import { expect } from 'storybook/test'
import RecordRelease from './RecordRelease'

const meta: Meta<typeof RecordRelease> = {
    title: 'Features/Records/ViewRecord/RecordRelease',
    component: RecordRelease,
    decorators: [
        (Story) => (
            <Box p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        format: MockRecord.format,
        type: MockRecord.type,
    },
}

export default meta
type Story = StoryObj<typeof RecordRelease>

export const Album: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByTestId('record-release')).toHaveTextContent('12" · Album')
    },
}

export const NonMusic: Story = {
    args: {
        format: RecordFormat.SEVEN_INCH,
        type: ReleaseType.NON_MUSIC,
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByTestId('record-release')).toHaveTextContent('7" · Non-Music')
    },
}
