import type { Meta, StoryObj } from '@storybook/react-vite'
import CalendarCell from './CalendarCell'
import { Grid } from '@chakra-ui/react'

const meta: Meta<typeof CalendarCell> = {
    title: 'Atoms/CalendarCell',
    component: CalendarCell,
    decorators: [
        (Story) => (
            <Grid templateColumns="repeat(7, 1fr)" w={'full'} maxW={'500px'}>
                <Story />
                {new Array(6).fill(null).map((_, index) => (
                    <CalendarCell key={index} variant="spacer" />
                ))}
            </Grid>
        ),
    ],
    args: {
        day: 15,
        variant: 'default',
        onClick: () => alert('Clicked!'),
    },
}

export default meta
type Story = StoryObj<typeof CalendarCell>

export const Default: Story = {}

export const Selected: Story = {
    args: {
        variant: 'selected',
    },
}

export const Highlighted: Story = {
    args: {
        variant: 'highlighted',
    },
}

export const SelectedHighlighted: Story = {
    args: {
        variant: 'selected-highlighted',
    },
}

export const Spacer: Story = {
    args: {
        variant: 'spacer',
    },
}
