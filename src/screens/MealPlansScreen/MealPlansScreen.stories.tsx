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
        onEditMealSubmit: fn(async (mealPlan) => ({
            date: mealPlan.date,
            mealTime: mealPlan.mealTime,
        })),
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

export const OpensEditMealPlanWithInitialValuesAndSubmits: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getAllByRole('button', { name: /edit meal/i })[0])

        const editMealPopup = canvas.getByText(/edit meal for/i).closest('form')

        expect(editMealPopup).not.toBeNull()

        const popup = within(editMealPopup!)
        const mealTimeSelect = popup.getByLabelText(/meal time/i, { selector: 'select' })

        expect(mealTimeSelect).toBeDisabled()
        expect(mealTimeSelect).toHaveValue(defaultInitialMeals[0].mealTime)

        await userEvent.click(popup.getByRole('button', { name: /next/i }))

        expect(popup.getByLabelText(/title/i, { selector: 'input' })).toHaveValue(
            defaultInitialMeals[0].title,
        )
        expect(popup.getByLabelText(/author/i, { selector: 'input' })).toHaveValue(
            defaultInitialMeals[0].author,
        )

        await userEvent.clear(popup.getByLabelText(/title/i, { selector: 'input' }))
        await userEvent.type(
            popup.getByLabelText(/title/i, { selector: 'input' }),
            'Updated Spaghetti Bolognese',
        )

        await userEvent.click(popup.getByRole('button', { name: /next/i }))

        expect(popup.getByLabelText(/book title/i, { selector: 'input' })).toHaveValue(
            'Mary Berry Everyday',
        )

        await userEvent.click(popup.getByRole('button', { name: /next/i }))
        await userEvent.click(popup.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(args.onEditMealSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Spaghetti Bolognese',
                    date: formatDate(startOfWeek),
                }),
                expect.objectContaining({
                    mealTime: defaultInitialMeals[0].mealTime,
                    source: defaultInitialMeals[0].source.type,
                    title: 'Updated Spaghetti Bolognese',
                    author: defaultInitialMeals[0].author,
                    bookTitle: 'Mary Berry Everyday',
                    pageNumber: '123',
                    prepDuration: '15',
                    cookingDuration: '30',
                    standingTime: '0',
                }),
            )
            expect(canvas.getByText(/updated spaghetti bolognese/i)).toBeInTheDocument()
        })
    },
}
