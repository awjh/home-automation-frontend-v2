import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import DottedValuePair from './DottedValuePair'

const meta: Meta<typeof DottedValuePair> = {
    title: 'Atoms/DottedValuePair',
    component: DottedValuePair,
    decorators: [
        (Story) => (
            <Box maxW="360px" p={4} w="full">
                <Story />
            </Box>
        ),
    ],
    args: {
        left: 'Chicken and leek pie',
        right: '45m',
    },
}

export default meta
type Story = StoryObj<typeof DottedValuePair>

export const Default: Story = {}

export const WrappingLeftValue: Story = {
    args: {
        left: 'Very long meal plan title that needs to wrap onto a second line before it reaches the duration',
        right: '1h 20m',
    },
}
