import MealPlan from '@defs/MealPlan'
import type { Meta, StoryObj } from '@storybook/react-vite'
import MockDate from 'mockdate'
import { expect, fn, type Mock, waitFor, within } from 'storybook/test'
import MealPlans from './MealPlans'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import BookMealPlanWithOptional from '@test/mockData/mealPlans/BookMealPlanWithOptional'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import InternalMealPlan from '@test/mockData/mealPlans/InternalMealPlan'
import LeftoversMealPlan from '@test/mockData/mealPlans/LeftoversMealPlan'
import MagazineMealPlan from '@test/mockData/mealPlans/MagazineMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import ReadyPreparedMealPlan from '@test/mockData/mealPlans/ReadyPreparedMealPlan'
import { formatDate } from '@utils/formatDate'

// April 7, 2026 — Tuesday. Clicking it highlights Sun Apr 5 – Sat Apr 11.
const mockingDate = new Date(2026, 3, 7)
const startOfWeek = new Date(2026, 3, 5)

const defaultInitialMeals: MealPlan[] = [
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

const meta: Meta<typeof MealPlans> = {
    title: 'Templates/MealPlans',
    component: MealPlans,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    decorators: [(Story) => <Story />],
    beforeEach: () => {
        MockDate.set(mockingDate)
        return () => MockDate.reset()
    },
    args: {
        initialMeals: defaultInitialMeals,
        getMealPlansForDateRange: fn().mockResolvedValue([]),
    },
}

export default meta
type Story = StoryObj<typeof MealPlans>

// Clicks April 7 (today) to trigger a fetch and shows the returned meal.
export const Default: Story = {}

// getMealPlansForDateRange returns an empty array — no DaysMeals panels are rendered.
export const NoMeals: Story = {
    args: {
        initialMeals: [],
    },
}

// Sun 29 Mar – Sat 4 Apr. Clicking Mar 31 triggers a fetch; the returned meals are rendered.
export const SelectDifferentWeek: Story = {
    play: async ({ canvas, args, userEvent }) => {
        const newWeekMeals = [
            InternalMealPlan,
            LeftoversMealPlan,
            ReadyPreparedMealPlan,
            BookMealPlanWithOptional,
        ].map((mealPlan, idx) => {
            const weekStart = new Date(2026, 2, 29) // Sun 29 Mar
            const mealDate = new Date(weekStart)
            mealDate.setDate(weekStart.getDate() + idx)
            return { ...mealPlan, date: formatDate(mealDate) }
        })
        ;(args.getMealPlansForDateRange as unknown as Mock).mockResolvedValue(newWeekMeals)

        const marchHeading = canvas.getByText(/march 2026/i)
        const marchDaysWrapper = marchHeading.nextElementSibling as HTMLElement

        const day31 = within(marchDaysWrapper).getByText('31')
        await userEvent.click(day31)

        const expectedStart = new Date(2026, 2, 29)
        const expectedEnd = new Date(2026, 3, 4)

        await waitFor(() =>
            expect(args.getMealPlansForDateRange).toHaveBeenCalledWith(expectedStart, expectedEnd),
        )

        // Day headings for the new week
        await waitFor(() =>
            expect(canvas.getByRole('heading', { name: /sunday.*29.*march/i })).toBeInTheDocument(),
        )
        expect(canvas.getByRole('heading', { name: /monday.*30.*march/i })).toBeInTheDocument()
        expect(canvas.getByRole('heading', { name: /tuesday.*31.*march/i })).toBeInTheDocument()
        expect(canvas.getByRole('heading', { name: /wednesday.*1.*april/i })).toBeInTheDocument()
        expect(canvas.getByRole('heading', { name: /thursday.*2.*april/i })).toBeInTheDocument()
        expect(canvas.getByRole('heading', { name: /friday.*3.*april/i })).toBeInTheDocument()
        expect(canvas.getByRole('heading', { name: /saturday.*4.*april/i })).toBeInTheDocument()

        // Meal titles from the fetched data
        expect(canvas.getByText(/^chicken satay$/i)).toBeInTheDocument()
        expect(canvas.getByText(/chicken satay \(leftovers\)/i)).toBeInTheDocument()
        expect(canvas.getByText(/chicken flatties \(ready_prepared\)/i)).toBeInTheDocument()
        expect(canvas.getByText(/chicken jalfrezi/i)).toBeInTheDocument()

        // Old week's day headings are gone
        expect(canvas.queryByRole('heading', { name: /sunday.*5.*april/i })).toBeNull()
    },
}
