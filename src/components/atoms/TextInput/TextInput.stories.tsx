import type { Meta, StoryObj } from '@storybook/react'
import TextInput from './TextInput'
import { Flex } from '@chakra-ui/react'

const meta: Meta<typeof TextInput> = {
    title: 'Atoms/TextInput',
    component: TextInput,
    decorators: [
        (Story) => (
            <Flex p={4} maxW={'400px'}>
                <Story />
            </Flex>
        ),
    ],
    args: {
        type: 'text',
        label: 'Example label',
        required: false,
    },
}

export default meta
type Story = StoryObj<typeof TextInput>

export const Default: Story = {}

export const Required: Story = {
    args: {
        required: true,
    },
}
