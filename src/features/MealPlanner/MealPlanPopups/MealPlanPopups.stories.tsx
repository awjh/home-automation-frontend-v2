import {
    GetExtractedExternalRecipeBasicsResponse,
    GetRecipesResponse,
    PostMealPlanResponse,
    PutMealPlanResponse,
} from '@awjh/home-automation-v2-api-models'
import type AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import MealPlan from '@defs/MealPlan'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import createMealPlanFixture from '@test/mockData/mealPlans/createMealPlanFixture'
import {
    bookFlowValues,
    createAddMealPlanStoryArgs,
    playBookFlow,
} from '@test/storybookHelpers/addMealPlan/storybookFlows'
import FlowSource from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/FlowSource'
import { formatDate } from '@utils/formatDate'
import { expect, fn, waitFor, within } from 'storybook/test'
import MealPlanPopups from './MealPlanPopups'

const addMealStoryArgs = createAddMealPlanStoryArgs()
const addMealDay = new Date(2026, 3, 10)
const existingMeal = createMealPlanFixture(BookMealPlanMissingOptional, {
    date: '2026-04-10',
})

type OnAddMealSubmit = (values: AddMealPlanFormValues) => Promise<PostMealPlanResponse>
type OnEditMealSubmit = (
    mealPlan: MealPlan,
    values: AddMealPlanFormValues,
) => Promise<PutMealPlanResponse>
type OnDeleteMealSubmit = (
    mealPlan: MealPlan,
) => Promise<Pick<MealPlan, 'date' | 'mealTime' | 'course'>>

interface MealPlanPopupsStoryArgs {
    initialMeals: MealPlan[]
    addMealDay: Date
    editMeal: MealPlan
    deleteMeal: MealPlan
    extractTitleFromOnlineSource: (url: string) => Promise<GetExtractedExternalRecipeBasicsResponse>
    searchInternalRecipes: (keywords: string) => Promise<GetRecipesResponse>
    onAddMealSubmit: OnAddMealSubmit
    onEditMealSubmit: OnEditMealSubmit
    onDeleteMealSubmit: OnDeleteMealSubmit
}

type StoryArgs = Partial<MealPlanPopupsStoryArgs>

const defaultStoryArgs: MealPlanPopupsStoryArgs = {
    initialMeals: [existingMeal],
    addMealDay,
    editMeal: existingMeal,
    deleteMeal: existingMeal,
    extractTitleFromOnlineSource:
        addMealStoryArgs.extractTitleFromOnlineSource as MealPlanPopupsStoryArgs['extractTitleFromOnlineSource'],
    searchInternalRecipes:
        addMealStoryArgs.searchInternalRecipes as MealPlanPopupsStoryArgs['searchInternalRecipes'],
    onAddMealSubmit: async () => ({}) as PostMealPlanResponse,
    onEditMealSubmit: async () => ({}) as PutMealPlanResponse,
    onDeleteMealSubmit: async (mealPlan) => ({
        date: mealPlan.date,
        mealTime: mealPlan.mealTime,
        course: mealPlan.course,
    }),
}

function MealPlanPopupsHarness({
    initialMeals,
    addMealDay,
    editMeal,
    deleteMeal,
    ...popupProps
}: MealPlanPopupsStoryArgs) {
    const [meals, setMeals] = useState(initialMeals)

    const onAddMealSuccess = (_response: PostMealPlanResponse, values: AddMealPlanFormValues) => {
        const createdMealPlan = createMealPlanFromFormValues(values)

        setMeals((currentMeals) => [...currentMeals, createdMealPlan])
    }

    const onEditMealSuccess = (
        mealPlan: MealPlan,
        _response: PutMealPlanResponse,
        values: AddMealPlanFormValues,
    ) => {
        const updatedMealPlan = {
            ...createMealPlanFromFormValues({
                ...values,
                mealTime: mealPlan.mealTime,
                course: mealPlan.course,
            }),
            mealTime: mealPlan.mealTime,
            course: mealPlan.course,
        }

        setMeals((currentMeals) =>
            currentMeals.map((currentMealPlan) =>
                currentMealPlan.date === mealPlan.date &&
                currentMealPlan.mealTime === mealPlan.mealTime &&
                currentMealPlan.course === mealPlan.course
                    ? updatedMealPlan
                    : currentMealPlan,
            ),
        )
    }

    const onDeleteMealSuccess = (
        deletedMealPlan: Pick<MealPlan, 'date' | 'mealTime' | 'course'>,
    ) => {
        setMeals((currentMeals) =>
            currentMeals.filter(
                (mealPlan) =>
                    !(
                        mealPlan.date === deletedMealPlan.date &&
                        mealPlan.mealTime === deletedMealPlan.mealTime &&
                        mealPlan.course === deletedMealPlan.course
                    ),
            ),
        )
    }

    return (
        <div style={{ minHeight: '100vh', padding: '24px' }}>
            <MealPlanPopups
                {...popupProps}
                flowSource={FlowSource.MEAL_PLANNER}
                onAddMealSuccess={onAddMealSuccess}
                onEditMealSuccess={onEditMealSuccess}
                onDeleteMealSuccess={onDeleteMealSuccess}
            >
                {({ onAddMeal, onDeleteMeal, onEditMeal }) => (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <button type={'button'} onClick={() => onAddMeal(addMealDay)}>
                                Open Add Meal Popup
                            </button>
                            <button type={'button'} onClick={() => onEditMeal(editMeal)}>
                                Open Edit Meal Popup
                            </button>
                            <button type={'button'} onClick={() => onDeleteMeal(deleteMeal)}>
                                Open Delete Meal Popup
                            </button>
                        </div>
                        <div data-testid={'meal-count'}>{meals.length}</div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {meals.map((mealPlan) => (
                                <div
                                    key={`${mealPlan.date}-${mealPlan.mealTime}-${mealPlan.course}`}
                                    data-testid={'meal-summary'}
                                >
                                    {mealPlan.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </MealPlanPopups>
        </div>
    )
}

const meta = {
    title: 'Features/MealPlanner/MealPlanPopups',
    component: MealPlanPopupsHarness,
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        initialMeals: defaultStoryArgs.initialMeals,
        addMealDay: defaultStoryArgs.addMealDay,
        editMeal: defaultStoryArgs.editMeal,
        deleteMeal: defaultStoryArgs.deleteMeal,
        extractTitleFromOnlineSource: defaultStoryArgs.extractTitleFromOnlineSource,
        searchInternalRecipes: defaultStoryArgs.searchInternalRecipes,
        onAddMealSubmit: fn<OnAddMealSubmit>(async () => ({}) as PostMealPlanResponse),
        onEditMealSubmit: fn<OnEditMealSubmit>(async () => ({}) as PutMealPlanResponse),
        onDeleteMealSubmit: fn<OnDeleteMealSubmit>(async (mealPlan) => ({
            date: mealPlan.date,
            mealTime: mealPlan.mealTime,
            course: mealPlan.course,
        })),
    },
} satisfies Meta<typeof MealPlanPopupsHarness>

export default meta

type Story = StoryObj<typeof meta>
type MockedStoryArgs = {
    onAddMealSubmit: ReturnType<typeof fn<OnAddMealSubmit>>
    onDeleteMealSubmit: ReturnType<typeof fn<OnDeleteMealSubmit>>
}

function resolveStoryArgs(args?: StoryArgs): MealPlanPopupsStoryArgs {
    return {
        ...defaultStoryArgs,
        ...args,
    }
}

function getAddFlowArgs(args?: StoryArgs) {
    const resolvedArgs = resolveStoryArgs(args)

    return {
        initialValues: {
            mealDate: formatDate(resolvedArgs.addMealDay),
        },
        extractTitleFromOnlineSource: resolvedArgs.extractTitleFromOnlineSource,
        searchInternalRecipes: resolvedArgs.searchInternalRecipes,
        onSubmit: resolvedArgs.onAddMealSubmit,
    }
}

function getMockedArgs(args?: StoryArgs): MockedStoryArgs {
    const resolvedArgs = resolveStoryArgs(args)

    return {
        onAddMealSubmit: resolvedArgs.onAddMealSubmit as MockedStoryArgs['onAddMealSubmit'],
        onDeleteMealSubmit:
            resolvedArgs.onDeleteMealSubmit as MockedStoryArgs['onDeleteMealSubmit'],
    }
}

export const Default: Story = {}

export const OpensAddPopup: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /open add meal popup/i }))

        await waitFor(() => {
            expect(canvas.getByTestId('add-meal-plan-modal')).toBeInTheDocument()
        })

        expect(canvas.getByText(/add meal for 10\/04\/2026/i)).toBeInTheDocument()
    },
}

export const AddsMealAndUpdatesState: Story = {
    args: {
        initialMeals: [],
    },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /open add meal popup/i }))

        const modal = await waitFor(() => canvas.getByTestId('add-meal-plan-modal'))

        await playBookFlow(within(modal), userEvent, getAddFlowArgs(args))

        await waitFor(() => {
            expect(canvas.queryByTestId('add-meal-plan-modal')).not.toBeInTheDocument()
            expect(canvas.getByTestId('meal-count')).toHaveTextContent('1')
            expect(canvas.getByText(bookFlowValues.title)).toBeInTheDocument()
        })
    },
}

export const OpensEditPopupWithExistingMeal: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /open edit meal popup/i }))

        const modal = await waitFor(() => canvas.getByTestId('add-meal-plan-modal'))
        const modalCanvas = within(modal)
        const sourceSelect = modalCanvas.getByLabelText(/source/i, { selector: 'select' })

        expect(modalCanvas.getByText(/edit meal for 10\/04\/2026/i)).toBeInTheDocument()
        expect(sourceSelect).toHaveValue(existingMeal.source.type)
    },
}

export const DeletesMealAfterConfirmation: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const { onDeleteMealSubmit } = getMockedArgs(args)
        onDeleteMealSubmit.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /open delete meal popup/i }))

        await waitFor(() => {
            expect(canvas.getByText(/delete meal plan\?/i)).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /confirm/i }))

        await waitFor(() => {
            expect(onDeleteMealSubmit).toHaveBeenCalledOnce()
            expect(canvas.getByTestId('meal-count')).toHaveTextContent('0')
            expect(canvas.queryByText(existingMeal.title)).not.toBeInTheDocument()
        })
    },
}
