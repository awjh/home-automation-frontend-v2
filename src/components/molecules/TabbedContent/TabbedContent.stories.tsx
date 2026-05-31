import { Box, Text } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import TabbedContent from './TabbedContent'

const childrenByTab = {
    Overview: (
        <Box p={4}>
            <Text>Overview content</Text>
        </Box>
    ),
    Ingredients: (
        <Box p={4}>
            <Text>Ingredients content</Text>
        </Box>
    ),
    Method: (
        <Box p={4}>
            <Text>Method content</Text>
        </Box>
    ),
}

const meta: Meta<typeof TabbedContent> = {
    title: 'Molecules/TabbedContent',
    component: TabbedContent,
    decorators: [(Story) => <Story />],
    args: {
        onTabChange: fn(),
    },
}

export default meta
type Story = StoryObj<typeof TabbedContent>

export const Default: Story = {
    render: (args) => <TabbedContent {...args} childrenByTab={childrenByTab} />,
}

export const SwitchesRenderedContent: Story = {
    render: Default.render,
    play: async ({ canvas, userEvent, args }) => {
        expect(canvas.getByText(/overview content/i)).toBeInTheDocument()
        expect(canvas.queryByText(/ingredients content/i)).not.toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /ingredients/i }))

        expect(args.onTabChange).toHaveBeenCalledWith('Ingredients')
        expect(canvas.getByText(/ingredients content/i)).toBeInTheDocument()
        expect(canvas.queryByText(/overview content/i)).not.toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /method/i }))

        expect(args.onTabChange).toHaveBeenCalledWith('Method')
        expect(canvas.getByText(/method content/i)).toBeInTheDocument()
        expect(canvas.queryByText(/ingredients content/i)).not.toBeInTheDocument()
    },
}
