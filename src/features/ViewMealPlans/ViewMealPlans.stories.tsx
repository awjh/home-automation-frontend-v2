import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import MealPlansView from './ViewMealPlans'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import MagazineMealPlan from '@test/mockData/mealPlans/MagazineMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import {
    bookFlowValues,
    createAddMealPlanStoryArgs,
    playBookFlow,
} from '@test/storybookHelpers/addMealPlan/storybookFlows'
import { formatDate } from '@utils/formatDate'

const startOfWeek = new Date(2026, 3, 5)
const addMealPlanStoryArgs = createAddMealPlanStoryArgs()

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

const meta: Meta<typeof MealPlansView> = {
    title: 'Features/ViewMealPlans',
    component: MealPlansView,
    args: {
        initialDate: startOfWeek,
        initialMeals: defaultInitialMeals,
        getMealPlansForDateRange: async () => [],
        extractTitleFromOnlineSource: addMealPlanStoryArgs.extractTitleFromOnlineSource,
        searchInternalRecipes: addMealPlanStoryArgs.searchInternalRecipes,
        onAddMealSubmit: fn().mockResolvedValue(undefined),
        onDeleteMealSubmit: fn().mockResolvedValue(undefined),
    },
}

export default meta

type Story = StoryObj<typeof MealPlansView>

export const Default: Story = {}

export const OpensAddMealPlanAndSubmits: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getAllByRole('button', { name: /add a meal/i })[0])

        const addMealPopup = canvas.getByText(/add meal for/i).closest('form')

        expect(addMealPopup).not.toBeNull()

        const submitFromPopup = fn(async (values) => {
            await args.onAddMealSubmit(formatDate(startOfWeek), values)
        })

        await playBookFlow(within(addMealPopup!), userEvent, {
            extractTitleFromOnlineSource: args.extractTitleFromOnlineSource,
            onSubmit: submitFromPopup,
            searchInternalRecipes: args.searchInternalRecipes,
        })

        await waitFor(() => {
            expect(args.onAddMealSubmit).toHaveBeenCalledWith(
                formatDate(startOfWeek),
                bookFlowValues,
            )
        })
    },
}

export const DeletesMealPlan: Story = {
    play: async ({ canvas, userEvent, args }) => {
        expect(canvas.getByText(/spaghetti bolognese/i)).toBeInTheDocument()
        expect(canvas.getAllByRole('button', { name: /delete meal/i })).toHaveLength(4)

        await userEvent.click(canvas.getAllByRole('button', { name: /delete meal/i })[0])

        expect(canvas.getByText(/delete meal plan\?/i)).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /confirm/i }))

        await waitFor(() => {
            expect(args.onDeleteMealSubmit).toHaveBeenCalledOnce()
            expect(args.onDeleteMealSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Spaghetti Bolognese',
                    date: formatDate(startOfWeek),
                }),
            )
            expect(canvas.queryByText(/delete meal plan\?/i)).not.toBeInTheDocument()
            expect(canvas.queryByText(/spaghetti bolognese/i)).not.toBeInTheDocument()
            expect(canvas.getAllByRole('button', { name: /delete meal/i })).toHaveLength(3)
        })
    },
}
