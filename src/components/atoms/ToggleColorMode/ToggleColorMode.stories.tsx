import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
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

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // ClientOnly renders a Skeleton first — wait for the real button to appear
        const button = await canvas.findByRole('button', { name: /toggle color mode/i })

        // Default theme is light → LuSun is rendered, which contains a <circle>
        await waitFor(() => expect(canvasElement.querySelector('circle')).toBeInTheDocument())

        // Click to toggle to dark mode
        await userEvent.click(button)

        // Dark mode → LuMoon is rendered, which has no <circle>
        await waitFor(() => expect(canvasElement.querySelector('circle')).not.toBeInTheDocument())
    },
}

/** Static stories for visual reference and manual interaction. */
export const Light: Story = {
    globals: { theme: 'light' },
}

export const Dark: Story = {
    globals: { theme: 'dark' },
}
