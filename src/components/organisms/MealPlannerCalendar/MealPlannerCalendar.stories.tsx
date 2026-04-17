import type { Meta, StoryObj } from '@storybook/react-vite'
import MealPlannerCalendar from './MealPlannerCalendar'
import { expect, fn, within } from 'storybook/test'
import { Canvas } from 'storybook/internal/csf'
import MockDate from 'mockdate'

const mockingDate = new Date(2026, 3, 7) // April 7, 2026

const meta: Meta<typeof MealPlannerCalendar> = {
    title: 'Organisms/MealPlannerCalendar',
    component: MealPlannerCalendar,
    decorators: [(Story) => <Story />],
    args: {
        initialDate: mockingDate,
        onDateRangeSelected: fn(),
    },
}

export default meta
type Story = StoryObj<typeof MealPlannerCalendar>

function validateMonthDays(
    canvas: Canvas,
    month: string,
    expectedNumDays: number,
    highlightedDays: [number, string?][] = [],
) {
    const monthHeading = canvas.getByText(new RegExp(month, 'i'))
    expect(monthHeading).toBeInTheDocument()

    const monthDaysWrapper = monthHeading.nextElementSibling as HTMLElement
    expect(monthDaysWrapper).not.toBeNull()

    for (let i = 1; i <= expectedNumDays; i++) {
        const day = within(monthDaysWrapper).getByText(i.toString())
        expect(day).toBeInTheDocument()

        const highlightInfo = highlightedDays.find((d) => d[0] === i)
        if (highlightInfo) {
            const cell = day.closest('[data-variant]')
            expect(cell).not.toBeNull()
            expect(cell).toHaveAttribute('data-variant', highlightInfo[1] || 'highlighted')
        } else {
            const cell = day.closest('[data-variant]')
            expect(cell).not.toBeNull()
            expect(cell).toHaveAttribute('data-variant', 'default')
        }
    }
    if (expectedNumDays < 31) {
        for (let i = expectedNumDays + 1; i <= 31; i++) {
            const day = within(monthDaysWrapper).queryByText(i.toString())
            expect(day).toBeNull()
        }
    }
}

export const Default: Story = {
    play: async ({ canvas, mount }) => {
        MockDate.set(mockingDate)
        await mount()

        validateMonthDays(canvas, 'march 2026', 31, [])
        validateMonthDays(canvas, 'april 2026', 30, [
            [5],
            [6],
            [7, 'selected-highlighted'],
            [8],
            [9],
            [10],
            [11],
        ])
        validateMonthDays(canvas, 'may 2026', 31, [])
    },
}

export const ShowPrevMonth: Story = {
    play: async ({ canvas, mount, userEvent }) => {
        MockDate.set(mockingDate)
        await mount()

        const prevButton = canvas.getByRole('button', { name: /show previous month/i })
        expect(prevButton).toBeInTheDocument()

        await userEvent.click(prevButton)

        validateMonthDays(canvas, 'february 2026', 28)
    },
}

export const ShowNextMonth: Story = {
    play: async ({ canvas, mount, userEvent }) => {
        MockDate.set(mockingDate)
        await mount()

        const nextButton = canvas.getByRole('button', { name: /show next month/i })
        expect(nextButton).toBeInTheDocument()

        await userEvent.click(nextButton)

        validateMonthDays(canvas, 'june 2026', 30)
    },
}

export const HighlightAnotherWeek: Story = {
    play: async ({ canvas, mount, userEvent }) => {
        MockDate.set(mockingDate)
        await mount()

        const monthHeading = canvas.getByText(new RegExp('march 2026', 'i'))
        expect(monthHeading).toBeInTheDocument()

        const monthDaysWrapper = monthHeading.nextElementSibling as HTMLElement
        expect(monthDaysWrapper).not.toBeNull()

        const day = within(monthDaysWrapper).getByText(22)
        expect(day).toBeInTheDocument()

        await userEvent.click(day)

        // new week is highlighted
        validateMonthDays(canvas, 'march 2026', 31, [[22], [23], [24], [25], [26], [27], [28]])

        // previous month highlight is removed but today's date is still selected
        validateMonthDays(canvas, 'april 2026', 30, [[7, 'selected']])
    },
}

export const HighlightWeekWhichEndsInNextMonth: Story = {
    play: async ({ canvas, mount, userEvent }) => {
        MockDate.set(mockingDate)
        await mount()

        const monthHeading = canvas.getByText(new RegExp('april 2026', 'i'))
        expect(monthHeading).toBeInTheDocument()

        const monthDaysWrapper = monthHeading.nextElementSibling as HTMLElement
        expect(monthDaysWrapper).not.toBeNull()

        const day = within(monthDaysWrapper).getByText(30)
        expect(day).toBeInTheDocument()

        await userEvent.click(day)

        // end of april and start of may are highlighted, today's date remains selected
        validateMonthDays(canvas, 'april 2026', 30, [[7, 'selected'], [26], [27], [28], [29], [30]])
        validateMonthDays(canvas, 'may 2026', 31, [[1], [2]])
    },
}

export const HighlightWeekWhichStartsInPreviousMonth: Story = {
    play: async ({ canvas, mount, userEvent }) => {
        MockDate.set(mockingDate)
        await mount()

        const monthHeading = canvas.getByText(new RegExp('april 2026', 'i'))
        expect(monthHeading).toBeInTheDocument()

        const monthDaysWrapper = monthHeading.nextElementSibling as HTMLElement
        expect(monthDaysWrapper).not.toBeNull()

        const day = within(monthDaysWrapper).getByText(1)
        expect(day).toBeInTheDocument()

        await userEvent.click(day)

        // end of march and start of april are highlighted, today's date remains selected
        validateMonthDays(canvas, 'march 2026', 31, [[29], [30], [31]])
        validateMonthDays(canvas, 'april 2026', 30, [[1], [2], [3], [4], [7, 'selected']])
    },
}

export const HighlightWeekWhichStartsInAMonthNotYetShown: Story = {
    play: async ({ canvas, mount, userEvent }) => {
        MockDate.set(mockingDate)
        await mount()

        const monthHeading = canvas.getByText(new RegExp('may 2026', 'i'))
        expect(monthHeading).toBeInTheDocument()

        const monthDaysWrapper = monthHeading.nextElementSibling as HTMLElement
        expect(monthDaysWrapper).not.toBeNull()

        const day = within(monthDaysWrapper).getByText(31)
        expect(day).toBeInTheDocument()

        await userEvent.click(day)

        // end of april and start of may are highlighted, today's date remains selected
        validateMonthDays(canvas, 'april 2026', 30, [[7, 'selected']])
        validateMonthDays(canvas, 'may 2026', 31, [[31]])

        const monthHeadingJune = canvas.queryByText(new RegExp('june 2026', 'i'))
        expect(monthHeadingJune).toBeNull()

        const nextButton = canvas.getByRole('button', { name: /show next month/i })
        expect(nextButton).toBeInTheDocument()

        await userEvent.click(nextButton)

        validateMonthDays(canvas, 'june 2026', 30, [[1], [2], [3], [4], [5], [6]])
    },
}
