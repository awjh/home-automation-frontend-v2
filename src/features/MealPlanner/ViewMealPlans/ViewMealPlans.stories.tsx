import MealPlan from '@defs/MealPlan'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import BookMealPlanWithOptional from '@test/mockData/mealPlans/BookMealPlanWithOptional'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import InternalMealPlan from '@test/mockData/mealPlans/InternalMealPlan'
import LeftoversMealPlan from '@test/mockData/mealPlans/LeftoversMealPlan'
import MagazineMealPlan from '@test/mockData/mealPlans/MagazineMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import ReadyPreparedMealPlan from '@test/mockData/mealPlans/ReadyPreparedMealPlan'
import { formatDate } from '@utils/formatDate'
import { expect, fn, waitFor, within } from 'storybook/test'
import ViewMealPlans from './ViewMealPlans'

const startOfWeek = new Date(2026, 3, 5)
const defaultInitialDate = new Date(startOfWeek.getTime())
defaultInitialDate.setDate(startOfWeek.getDate() + 2) // Start on Wednesday

const defaultInitialMeals = [
    BookMealPlanMissingOptional,
    FreezerMealPlan,
    MagazineMealPlan,
    OnlineMealPlan,
].map((mealPlan, idx) => {
    const mealDate = new Date(startOfWeek)
    mealDate.setDate(startOfWeek.getDate() + idx)
    return {
        ...mealPlan,
        date: formatDate(mealDate),
    }
})

const nextWeeksMeals = [
    BookMealPlanWithOptional,
    InternalMealPlan,
    LeftoversMealPlan,
    ReadyPreparedMealPlan,
].map((mealPlan, idx) => {
    const mealDate = new Date(startOfWeek)
    mealDate.setDate(startOfWeek.getDate() + 7 + idx) // Next week
    return {
        ...mealPlan,
        date: formatDate(mealDate),
    }
})

type OnAddMeal = (day: Date) => void
type OnDeleteMeal = (mealPlan: MealPlan) => void
type OnEditMeal = (mealPlan: MealPlan) => void
type OnDateRangeSelected = (startDate: Date, endDate: Date) => void
type StoryCanvas = {
    getByText: (matcher: (content: string, element: Element | null) => boolean) => HTMLElement
}

const onDateRangeSelectedMock = fn<OnDateRangeSelected>()
const onAddMealMock = fn<OnAddMeal>()
const onDeleteMealMock = fn<OnDeleteMeal>()
const onEditMealMock = fn<OnEditMeal>()

function getDateRangeForWeek(date: Date) {
    const startDate = new Date(date)
    startDate.setDate(date.getDate() - date.getDay())

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    return { startDate, endDate }
}

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeWhitespace(value: string) {
    return value.replace(/\s+/g, ' ').trim()
}

function getDaySection(canvas: StoryCanvas, day: Date) {
    const weekday = day.toLocaleDateString('en-GB', { weekday: 'long' })
    const month = day.toLocaleDateString('en-GB', { month: 'long' })
    const dateNumber = day.getDate().toString()

    const heading = canvas.getByText((_: string, element: Element | null) => {
        if (!(element instanceof HTMLElement)) {
            return false
        }

        if (!/^H[1-6]$/.test(element.tagName)) {
            return false
        }

        const textContent = normalizeWhitespace(element.textContent ?? '')

        return textContent.startsWith(`${weekday} ${dateNumber}`) && textContent.endsWith(month)
    })

    const daySection = heading.parentElement

    if (!daySection) {
        throw new Error(`Could not find day section for ${formatDate(day)}`)
    }

    return daySection
}

const meta: Meta<typeof ViewMealPlans> = {
    title: 'Features/MealPlanner/ViewMealPlans',
    component: ViewMealPlans,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [(Story) => <Story />],
    args: {
        initialDate: defaultInitialDate,
        meals: defaultInitialMeals,
        selectedDateRange: getDateRangeForWeek(defaultInitialDate),
        onDateRangeSelected: onDateRangeSelectedMock,
        onAddMeal: onAddMealMock,
        onDeleteMeal: onDeleteMealMock,
        onEditMeal: onEditMealMock,
    },
}

export default meta

type Story = StoryObj<typeof ViewMealPlans>
type MockedStoryArgs = {
    onDateRangeSelected: typeof onDateRangeSelectedMock
    onAddMeal: typeof onAddMealMock
    onDeleteMeal: typeof onDeleteMealMock
    onEditMeal: typeof onEditMealMock
}

function getMockedArgs(args: Story['args']): MockedStoryArgs {
    return args as MockedStoryArgs
}

export const PageLoad: Story = {}

export const AddMealPlanCanBeClicked: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const { onAddMeal } = getMockedArgs(args)
        const addMealButtons = canvas.getAllByRole('button', { name: /add a meal/i })
        expect(addMealButtons).toHaveLength(7 - defaultInitialMeals.length) // Should show add meal buttons for days without meals

        await userEvent.click(addMealButtons[0])

        await waitFor(() => {
            expect(onAddMeal).toHaveBeenCalledOnce()
        })

        const addDate = new Date(startOfWeek)
        addDate.setDate(startOfWeek.getDate() + defaultInitialMeals.length) // The first add button should correspond to the first day without a meal

        const clickedDay = onAddMeal.mock.calls[0][0]
        expect(formatDate(clickedDay)).toBe(formatDate(addDate))
    },
}

export const DeleteMealPlanCanBeClicked: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const { onDeleteMeal } = getMockedArgs(args)
        const deleteMealButtons = canvas.getAllByRole('button', { name: /delete meal/i })
        expect(deleteMealButtons).toHaveLength(defaultInitialMeals.length) // Should show delete meal buttons for days with meals

        await userEvent.click(deleteMealButtons[0])

        await waitFor(() => {
            expect(onDeleteMeal).toHaveBeenCalledOnce()
        })

        const deleteDate = new Date(startOfWeek)
        deleteDate.setDate(startOfWeek.getDate() + 0) // The first delete button should correspond to the first day with a meal

        const clickedMealPlan = onDeleteMeal.mock.calls[0][0]
        expect(clickedMealPlan.date).toBe(formatDate(deleteDate))
    },
}

export const EditMealPlanCanBeClicked: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const { onEditMeal } = getMockedArgs(args)
        const editMealButtons = canvas.getAllByRole('button', { name: /edit meal/i })
        expect(editMealButtons).toHaveLength(defaultInitialMeals.length) // Should show edit meal buttons for days with meals

        await userEvent.click(editMealButtons[0])

        await waitFor(() => {
            expect(onEditMeal).toHaveBeenCalledOnce()
        })

        const editDate = new Date(startOfWeek)
        editDate.setDate(startOfWeek.getDate() + 0) // The first edit button should correspond to the first day with a meal

        const clickedMealPlan = onEditMeal.mock.calls[0][0]
        expect(clickedMealPlan.date).toBe(formatDate(editDate))
    },
}

export const SelectsNewWeekAndReplacesMeals: Story = {
    render: (args) => {
        const [meals, setMeals] = useState(args.meals)
        const [selectedDateRange, setSelectedDateRange] = useState(args.selectedDateRange)

        const handleDateRangeSelected = (startDate: Date, endDate: Date) => {
            args.onDateRangeSelected(startDate, endDate)
            setSelectedDateRange({ startDate, endDate })
            setMeals(nextWeeksMeals)
        }

        return (
            <ViewMealPlans
                {...args}
                meals={meals}
                selectedDateRange={selectedDateRange}
                onDateRangeSelected={handleDateRangeSelected}
            />
        )
    },
    play: async ({ args, canvas, userEvent }) => {
        const { onDateRangeSelected } = getMockedArgs(args)

        const aprilHeading = canvas.getByText(/april 2026/i)
        const aprilCalendar = aprilHeading.nextElementSibling as HTMLElement

        expect(aprilCalendar).not.toBeNull()

        await userEvent.click(within(aprilCalendar).getByText('12'))

        await waitFor(() => {
            expect(onDateRangeSelected).toHaveBeenCalledOnce()
        })

        const [selectedStartDate, selectedEndDate] = onDateRangeSelected.mock.calls[0]

        const startOfNextWeek = new Date(startOfWeek)
        startOfNextWeek.setDate(startOfNextWeek.getDate() + 7)
        const endOfNextWeek = new Date(startOfNextWeek)
        endOfNextWeek.setDate(endOfNextWeek.getDate() + 6)

        expect(formatDate(selectedStartDate)).toBe(formatDate(startOfNextWeek))
        expect(formatDate(selectedEndDate)).toBe(formatDate(endOfNextWeek))

        const expectedTitlesByDay = nextWeeksMeals.reduce<Record<string, Record<string, number>>>(
            (groups, meal) => {
                groups[meal.date] ??= {}
                groups[meal.date][meal.title] = (groups[meal.date][meal.title] ?? 0) + 1
                return groups
            },
            {},
        )

        for (const [date, titleCounts] of Object.entries(expectedTitlesByDay)) {
            const daySection = getDaySection(canvas, new Date(date))

            for (const [title, count] of Object.entries(titleCounts)) {
                expect(
                    within(daySection).getAllByText(new RegExp(escapeRegExp(title), 'i')),
                ).toHaveLength(count)
            }
        }
    },
}
