import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@chakra-ui/react'
import { expect, fn, waitFor } from 'storybook/test'
import Tag from './Tag'

const meta: Meta<typeof Tag> = {
    title: 'Atoms/Tag',
    component: Tag,
    decorators: [
        (Story) => (
            <Box p={4}>
                <Story />
            </Box>
        ),
    ],
    args: {
        value: 'Poultry',
    },
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {}

export const Subtle: Story = {
    args: {
        status: 'subtle',
    },
}

export const Highlighted: Story = {
    args: {
        status: 'highlighted',
    },
}

export const Clickable: Story = {
    args: {
        onClick: fn(),
    },
    play: async ({ args, canvas, userEvent }) => {
        const tag = await canvas.findByRole('button', { name: /poultry/i })

        await userEvent.click(tag)

        await waitFor(() => expect(args.onClick).toHaveBeenCalled())
    },
}

export const ClickableSubtle: Story = {
    args: {
        status: 'subtle',
        onClick: fn(),
    },
    play: async ({ args, canvas, userEvent }) => {
        const tag = await canvas.findByRole('button', { name: /poultry/i })

        await userEvent.click(tag)

        await waitFor(() => expect(args.onClick).toHaveBeenCalled())
    },
}

export const ClickableHighlighted: Story = {
    args: {
        status: 'highlighted',
        onClick: fn(),
    },
    play: async ({ args, canvas, userEvent }) => {
        const tag = await canvas.findByRole('button', { name: /poultry/i })

        await userEvent.click(tag)

        await waitFor(() => expect(args.onClick).toHaveBeenCalled())
    },
}
