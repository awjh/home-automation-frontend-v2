import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecordSearchResult from '@test/mockData/records/MockRecordSearchResult'
import { expect } from 'storybook/test'
import SearchRecordResult from './SearchRecordResult'

const meta: Meta<typeof SearchRecordResult> = {
    title: 'Features/Records/SearchRecords/SearchRecordResult',
    component: SearchRecordResult,
    decorators: [
        (Story) => (
            <Box maxW="900px" p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        colorStyle: 'primary',
        record: MockRecordSearchResult,
    },
}

export default meta
type Story = StoryObj<typeof SearchRecordResult>

export const Primary: Story = {
    play: async ({ canvas }) => {
        expect(
            canvas.getByRole('heading', { name: 'Rumours - Fleetwood Mac' }).closest('a'),
        ).toHaveAttribute('href', `/records/${MockRecordSearchResult.id}`)
        expect(canvas.getByTestId('record-details')).toHaveTextContent(
            'Warner Bros. Records · K 56344 · 1977',
        )
        expect(canvas.getByText('12" · album')).toBeInTheDocument()
        expect(canvas.getByText('rock')).toBeInTheDocument()
        expect(canvas.getByRole('img', { name: 'Rumours' })).toHaveAttribute('src', '/recipe.jpg')
    },
}

export const Subtle: Story = {
    args: {
        colorStyle: 'subtle',
    },
}

export const NoImage: Story = {
    args: {
        record: { ...MockRecordSearchResult, image: undefined },
    },
    play: async ({ canvas }) => {
        expect(canvas.queryByRole('img', { name: 'Rumours' })).not.toBeInTheDocument()
    },
}
