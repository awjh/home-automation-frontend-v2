import type { Meta, StoryObj } from '@storybook/react'
import ToggleColorMode from './ToggleColorMode'
import { Flex } from '@chakra-ui/react'

const meta: Meta<typeof ToggleColorMode> = {
    title: 'Atoms/ToggleColorMode',
    component: ToggleColorMode,
    decorators: [
        (Story) => (
            <Flex p={4} maxW={'400px'}>
                <Story />
            </Flex>
        ),
    ],
    args: {},
}

export default meta
type Story = StoryObj<typeof ToggleColorMode>

export const Default: Story = {}
