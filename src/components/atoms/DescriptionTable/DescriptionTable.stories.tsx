import type { Meta, StoryObj } from '@storybook/react-vite'
import DescriptionTable from './DescriptionTable'

const meta: Meta<typeof DescriptionTable> = {
    title: 'Atoms/DescriptionTable',
    component: DescriptionTable,
    decorators: [(Story) => <Story />],
    args: {
        data: [
            { key: 'calories', value: 100 },
            { key: 'duration', value: '1h 45m' },
            { key: 'serves', value: 4 },
        ],
    },
}

export default meta
type Story = StoryObj<typeof DescriptionTable>

export const Default: Story = {}
