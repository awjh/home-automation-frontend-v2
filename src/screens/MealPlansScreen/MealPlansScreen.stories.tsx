import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import MagazineMealPlan from '@test/mockData/mealPlans/MagazineMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import {
    bookFlowValues,
    createAddMealPlanStoryArgs,
    playBookFlow,
    playOnlineFlowLeavingExtractedDetails,
    onlineFlowUsingExtractedValues,
} from '@test/storybookHelpers/addMealPlan/storybookFlows'
import { formatDate } from '@utils/formatDate'
import MealPlansScreen from './MealPlansScreen'

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

const meta: Meta<typeof MealPlansScreen> = {
    title: 'Screens/MealPlansScreen',
    component: MealPlansScreen,
    args: {
        initialDate: startOfWeek,
        initialMeals: defaultInitialMeals,
        getMealPlansForDateRange: async () => [],
        extractTitleFromOnlineSource: addMealPlanStoryArgs.extractTitleFromOnlineSource,
        searchInternalRecipes: addMealPlanStoryArgs.searchInternalRecipes,
        onAddMealSubmit: fn(async (date, values) => createMealPlanFromFormValues(date, values)),
        onDeleteMealSubmit: fn(async (mealPlan) => ({
            date: mealPlan.date,
            mealTime: mealPlan.mealTime,
        })),
    },
}

export default meta

type Story = StoryObj<typeof MealPlansScreen>

export const Default: Story = {}

export const OpensAddMealPlanSubmitsAndAddsToMealList: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getAllByRole('button', { name: /add a meal/i })[0])

        const addMealPopup = canvas.getByText(/add meal for/i).closest('form')

        expect(addMealPopup).not.toBeNull()

        const expectedDate = new Date(startOfWeek)
        expectedDate.setDate(startOfWeek.getDate() + defaultInitialMeals.length)

        await playBookFlow(within(addMealPopup!), userEvent, {
            extractTitleFromOnlineSource: args.extractTitleFromOnlineSource,
            assertSubmitted: async (values) => {
                await waitFor(() => {
                    expect(args.onAddMealSubmit).toHaveBeenCalledWith(
                        formatDate(expectedDate),
                        values,
                    )
                })
            },
            onSubmit: fn().mockResolvedValue(undefined),
            searchInternalRecipes: args.searchInternalRecipes,
        })

        await waitFor(() => {
            expect(args.onAddMealSubmit).toHaveBeenCalledWith(
                formatDate(expectedDate),
                bookFlowValues,
            )
            expect(canvas.getByText(/traybake/i)).toBeInTheDocument()
        })
    },
}

export const OpensAddMealPlanUsingExtractedOnlineTitle: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getAllByRole('button', { name: /add a meal/i })[0])

        const addMealPopup = canvas.getByText(/add meal for/i).closest('form')

        expect(addMealPopup).not.toBeNull()

        const expectedDate = new Date(startOfWeek)
        expectedDate.setDate(startOfWeek.getDate() + defaultInitialMeals.length)

        await playOnlineFlowLeavingExtractedDetails(within(addMealPopup!), userEvent, {
            extractTitleFromOnlineSource: args.extractTitleFromOnlineSource,
            assertSubmitted: async (values) => {
                await waitFor(() => {
                    expect(args.onAddMealSubmit).toHaveBeenCalledWith(
                        formatDate(expectedDate),
                        values,
                    )
                })
            },
            onSubmit: fn().mockResolvedValue(undefined),
            searchInternalRecipes: args.searchInternalRecipes,
        })

        await waitFor(() => {
            expect(args.onAddMealSubmit).toHaveBeenCalledWith(
                formatDate(expectedDate),
                onlineFlowUsingExtractedValues,
            )
            expect(canvas.getByText(/gnocchi in roasted red pepper sauce/i)).toBeInTheDocument()
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
