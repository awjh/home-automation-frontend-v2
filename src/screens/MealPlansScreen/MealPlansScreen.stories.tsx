import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import type { Meta, StoryObj } from '@storybook/react-vite'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import createMealPlanFixture from '@test/mockData/mealPlans/createMealPlanFixture'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import MagazineMealPlan from '@test/mockData/mealPlans/MagazineMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import {
    bookFlowValues,
    createAddMealPlanStoryArgs,
    onlineFlowUsingExtractedValues,
    playBookFlow,
    playBookFlowMarkedForLeftovers,
    playOnlineFlowLeavingExtractedDetails,
} from '@test/storybookHelpers/addMealPlan/storybookFlows'
import { formatDate } from '@utils/formatDate'
import { expect, fn, screen, waitFor, within } from 'storybook/test'
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
    return createMealPlanFixture(mealPlan, {
        date: formatDate(mealDate),
    })
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
        onAddMealSubmit: fn(async (values) => createMealPlanFromFormValues(values)),
        onEditMealSubmit: fn(async (mealPlan) => ({
            date: mealPlan.date,
            mealTime: mealPlan.mealTime,
            course: mealPlan.course,
        })),
        onDeleteMealSubmit: fn(async (mealPlan) => ({
            date: mealPlan.date,
            mealTime: mealPlan.mealTime,
            course: mealPlan.course,
            relatedMealPlans: [],
        })),
    },
}

export default meta

type Story = StoryObj<typeof MealPlansScreen>

export const Default: Story = {}

export const OpensAddMealPlanSubmitsAndAddsToMealList: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getAllByRole('button', { name: /add a meal/i })[0])

        const addMealPopup = await waitFor(() => canvas.getByTestId('add-meal-plan-modal'))

        const expectedDate = new Date(startOfWeek)
        expectedDate.setDate(startOfWeek.getDate() + defaultInitialMeals.length)

        await playBookFlow(within(addMealPopup), userEvent, {
            extractTitleFromOnlineSource: args.extractTitleFromOnlineSource,
            assertSubmitted: async (values) => {
                await waitFor(() => {
                    expect(args.onAddMealSubmit).toHaveBeenCalledWith({
                        ...values,
                        mealDate: formatDate(expectedDate),
                    })
                })
            },
            onSubmit: fn().mockResolvedValue(undefined),
            searchInternalRecipes: args.searchInternalRecipes,
        })

        await waitFor(() => {
            expect(args.onAddMealSubmit).toHaveBeenCalledWith({
                ...bookFlowValues,
                mealDate: formatDate(expectedDate),
            })
            expect(canvas.getByText(/traybake/i)).toBeInTheDocument()
        })
    },
}

export const OpensAddMealPlanUsingExtractedOnlineTitle: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getAllByRole('button', { name: /add a meal/i })[0])

        const addMealPopup = await waitFor(() => canvas.getByTestId('add-meal-plan-modal'))

        const expectedDate = new Date(startOfWeek)
        expectedDate.setDate(startOfWeek.getDate() + defaultInitialMeals.length)

        await playOnlineFlowLeavingExtractedDetails(within(addMealPopup), userEvent, {
            extractTitleFromOnlineSource: args.extractTitleFromOnlineSource,
            assertSubmitted: async (values) => {
                await waitFor(() => {
                    expect(args.onAddMealSubmit).toHaveBeenCalledWith({
                        ...values,
                        mealDate: formatDate(expectedDate),
                    })
                })
            },
            onSubmit: fn().mockResolvedValue(undefined),
            searchInternalRecipes: args.searchInternalRecipes,
        })

        await waitFor(() => {
            expect(args.onAddMealSubmit).toHaveBeenCalledWith({
                ...onlineFlowUsingExtractedValues,
                mealDate: formatDate(expectedDate),
            })
            expect(canvas.getByText(/gnocchi in roasted red pepper sauce/i)).toBeInTheDocument()
        })
    },
}

export const OpensLeftoversFollowUpAfterSuccessfulAdd: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getAllByRole('button', { name: /add a meal/i })[0])

        const addMealPopup = await waitFor(() => canvas.getByTestId('add-meal-plan-modal'))

        const expectedDate = new Date(startOfWeek)
        expectedDate.setDate(startOfWeek.getDate() + defaultInitialMeals.length)
        const expectedFormattedDate = formatDate(expectedDate)
        const leftoversDate = '2026-04-11'

        await playBookFlowMarkedForLeftovers(within(addMealPopup), userEvent, {
            extractTitleFromOnlineSource: args.extractTitleFromOnlineSource,
            assertSubmitted: async (values) => {
                await waitFor(() => {
                    expect(args.onAddMealSubmit).toHaveBeenCalledWith({
                        ...values,
                        mealDate: expectedFormattedDate,
                    })
                })
            },
            onSubmit: fn().mockResolvedValue(undefined),
            searchInternalRecipes: args.searchInternalRecipes,
        })

        const leftoversPopup = within(addMealPopup)
        const sourceSelect = leftoversPopup.getByLabelText(/source/i, { selector: 'select' })

        await waitFor(() => {
            expect(args.onAddMealSubmit).toHaveBeenCalledWith({
                ...bookFlowValues,
                mealDate: expectedFormattedDate,
                useForLeftovers: true,
                leftoversDate,
            })
            expect(sourceSelect).toBeDisabled()
            expect(sourceSelect).toHaveValue(SourceType.LEFTOVERS)
        })

        expect(canvas.getByText(/add meal for 11\/04\/2026/i)).toBeInTheDocument()

        await userEvent.selectOptions(
            leftoversPopup.getByLabelText(/meal time/i, { selector: 'select' }),
            MealTime.LUNCH,
        )
        await userEvent.click(leftoversPopup.getByRole('button', { name: /next/i }))

        expect(leftoversPopup.getByLabelText(/title/i, { selector: 'input' })).toHaveValue(
            bookFlowValues.title,
        )
        expect(leftoversPopup.getByLabelText(/author/i, { selector: 'input' })).toHaveValue(
            bookFlowValues.author,
        )

        await userEvent.click(leftoversPopup.getByRole('button', { name: /next/i }))

        expect(
            leftoversPopup.getByLabelText(/original meal date/i, { selector: 'input' }),
        ).toHaveValue(expectedFormattedDate)

        await userEvent.click(leftoversPopup.getByRole('button', { name: /next/i }))
        await userEvent.click(leftoversPopup.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(args.onAddMealSubmit).toHaveBeenNthCalledWith(2, {
                ...bookFlowValues,
                mealDate: leftoversDate,
                mealTime: MealTime.LUNCH,
                course: bookFlowValues.course,
                source: SourceType.LEFTOVERS,
                useForLeftovers: false,
                leftoversDate: '',
                title: bookFlowValues.title,
                author: bookFlowValues.author,
                fromDate: expectedFormattedDate,
                fromMealTime: bookFlowValues.mealTime,
                fromCourse: bookFlowValues.course,
                bookTitle: '',
                pageNumber: '',
                series: '',
                recipeUrl: '',
                magazineName: '',
                magazineIssue: '',
                magazinePage: '',
                internalRecipeId: '',
                prepDuration: bookFlowValues.prepDuration,
                cookingDuration: bookFlowValues.cookingDuration,
                standingTime: bookFlowValues.standingTime,
            })
            expect(args.onAddMealSubmit).toHaveBeenCalledTimes(2)
            expect(canvas.getAllByText(/traybake/i)).toHaveLength(2)
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

        expect(await screen.findByText(/deleted meal plan/i)).toBeInTheDocument()
        expect(await screen.findByText(/successfully deleted/i)).toBeInTheDocument()
    },
}

export const DeletesMealPlanAndRelatedMealPlans: Story = {
    args: {
        onDeleteMealSubmit: fn(async (mealPlan) => ({
            date: mealPlan.date,
            mealTime: mealPlan.mealTime,
            course: mealPlan.course,
            relatedMealPlans: [
                {
                    date: defaultInitialMeals[1].date,
                    mealTime: defaultInitialMeals[1].mealTime,
                    course: defaultInitialMeals[1].course,
                },
            ],
        })),
    },
    play: async ({ canvas, userEvent, args }) => {
        expect(canvas.getAllByRole('button', { name: /delete meal/i })).toHaveLength(4)

        await userEvent.click(canvas.getAllByRole('button', { name: /delete meal/i })[0])
        await userEvent.click(canvas.getByRole('button', { name: /confirm/i }))

        await waitFor(() => {
            expect(args.onDeleteMealSubmit).toHaveBeenCalledOnce()
            expect(args.onDeleteMealSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    date: formatDate(startOfWeek),
                }),
            )
            expect(canvas.queryByText(/delete meal plan\?/i)).not.toBeInTheDocument()
            expect(canvas.getAllByRole('button', { name: /delete meal/i })).toHaveLength(2)
        })

        await waitFor(
            () => {
                expect(screen.getByText(/deleted meal plan/i)).toBeInTheDocument()
                expect(screen.getByText(/successfully deleted/i)).toBeInTheDocument()
                expect(screen.getByText(/06\/04\/2026/i)).toBeInTheDocument()
                expect(screen.getByText(/have also been deleted/i)).toBeInTheDocument()
            },
            { timeout: 5000 },
        )
    },
}

export const OpensEditMealPlanWithInitialValuesAndSubmits: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getAllByRole('button', { name: /edit meal/i })[0])

        const editMealPopup = await waitFor(() => canvas.getByTestId('add-meal-plan-modal'))

        const popup = within(editMealPopup)
        const mealTimeSelect = popup.getByLabelText(/meal time/i, { selector: 'select' })

        expect(mealTimeSelect).toBeDisabled()
        expect(mealTimeSelect).toHaveValue(defaultInitialMeals[0].mealTime)

        const courseSelect = popup.getByLabelText(/course/i, { selector: 'select' })

        expect(courseSelect).toBeDisabled()
        expect(courseSelect).toHaveValue(defaultInitialMeals[0].course)

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
                    mealDate: formatDate(startOfWeek),
                    course: defaultInitialMeals[0].course,
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
