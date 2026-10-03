import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import { expect } from 'storybook/test'
import ViewRecord from './ViewRecord'

const meta: Meta<typeof ViewRecord> = {
    title: 'Features/Records/ViewRecord',
    component: ViewRecord,
    args: {
        record: MockRecord,
    },
}

export default meta
type Story = StoryObj<typeof ViewRecord>

export const Default: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Rumours')
        await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Fleetwood Mac')
        await expect(canvas.getByText('2. Dreams')).toBeInTheDocument()
        await expect(canvas.getByText('04:14')).toBeInTheDocument()
    },
}

export const WithoutImage: Story = {
    args: {
        record: {
            ...MockRecord,
            image: undefined,
        },
    },
}
