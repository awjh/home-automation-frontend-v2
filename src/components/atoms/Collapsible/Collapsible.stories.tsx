import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Text } from '@chakra-ui/react'
import { expect, waitFor } from 'storybook/test'
import Collapsible from './Collapsible'

const meta: Meta<typeof Collapsible> = {
    title: 'Atoms/Collapsible',
    component: Collapsible,
    decorators: [
        (Story) => (
            <Box p={4}>
                <Story />
            </Box>
        ),
    ],
    args: {
        title: 'Main House',
    },
    render: (args) => (
        <Collapsible {...args}>
            <Box p={4}>
                <Text>Collapsible content</Text>
            </Box>
        </Collapsible>
    ),
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
    play: async ({ canvas }) => {
        const trigger = canvas.getByRole('button', { name: 'Main House' })

        expect(trigger).toHaveAttribute('aria-expanded', 'false')
        expect(canvas.getByText('Collapsible content')).not.toBeVisible()
    },
}

export const DefaultOpen: Story = {
    args: {
        defaultOpen: true,
    },
    play: async ({ canvas }) => {
        expect(canvas.getByRole('button', { name: 'Main House' })).toHaveAttribute(
            'aria-expanded',
            'true',
        )
        expect(canvas.getByText('Collapsible content')).toBeVisible()
    },
}

export const OpensAndCloses: Story = {
    play: async ({ canvas, canvasElement, userEvent }) => {
        const trigger = canvas.getByRole('button', { name: 'Main House' })
        const indicator = canvasElement.querySelector('[data-part="indicator"]')

        expect(indicator).toHaveAttribute('data-state', 'closed')

        await userEvent.click(trigger)

        await waitFor(() => {
            expect(trigger).toHaveAttribute('aria-expanded', 'true')
            expect(indicator).toHaveAttribute('data-state', 'open')
            expect(canvas.getByText('Collapsible content')).toBeVisible()
        })

        await userEvent.click(trigger)

        await waitFor(() => {
            expect(trigger).toHaveAttribute('aria-expanded', 'false')
            expect(indicator).toHaveAttribute('data-state', 'closed')
            expect(canvas.getByText('Collapsible content')).not.toBeVisible()
        })
    },
}

export const OutlineSurroundsContentWhenOpen: Story = {
    args: {
        defaultOpen: true,
    },
    play: async ({ canvas, canvasElement }) => {
        const root = canvasElement.querySelector('[data-part="root"]')

        expect(root).toContainElement(canvas.getByRole('button', { name: 'Main House' }))
        expect(root).toContainElement(canvas.getByText('Collapsible content'))
        expect(getComputedStyle(root as Element).borderTopWidth).toBe('2px')
    },
}
