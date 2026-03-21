import type { Meta, StoryObj } from '@storybook/react-vite'
import Calendar from './Calendar'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const meta: Meta<typeof Calendar> = {
    title: 'Molecules/Calendar',
    component: Calendar,
    decorators: [(Story) => <Story />],
    args: {
        month: 3,
        year: 2026,
        onSelect: (date) => alert(`Selected date: ${date.toDateString()}`),
    },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {}

export const TestClickDay: Story = {
    args: {
        onSelect: fn(),
    },
    play: async ({ canvas, args }) => {
        const button = canvas.getByText('15')
        await userEvent.click(button)

        expect(args.onSelect).toHaveBeenCalledOnce()
    },
}

export const FirstDaySunday: Story = {
    args: {
        month: 2,
        year: 2026,
    },
}

export const LastDaySaturday: Story = {
    args: {
        month: 0,
        year: 2026,
    },
}

export const FirstDaySundayLastDaySaturday: Story = {
    args: {
        month: 1,
        year: 2026,
    },
}

export const HighlightPeriod: Story = {
    args: {
        month: 3,
        year: 2026,
        highlightPeriod: {
            startDay: 6,
            endDay: 9,
        },
    },
}

export const SelectedDay: Story = {
    args: {
        month: 3,
        year: 2026,
        selectedDay: 15,
    },
}

export const SelectedDayWithinHighlightedPeriod: Story = {
    args: {
        month: 3,
        year: 2026,
        selectedDay: 15,
        highlightPeriod: {
            startDay: 10,
            endDay: 20,
        },
    },
}
