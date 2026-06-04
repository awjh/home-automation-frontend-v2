import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import createMealPlanFromFormValues from '@features/MealPlanner/AddMealPlan/utils/createMealPlanFromFormValues'
import type { Meta, StoryObj } from '@storybook/react-vite'
import OnlineRecipeWithImage from '@test/mockData/recipes/OnlineRecipeWithImage'
import formatAuthors from '@utils/formatAuthors'
import MockDate from 'mockdate'
import { useEffect } from 'react'
import { expect, fn, waitFor, within } from 'storybook/test'
import RecipeScreen from './RecipeScreen'

const mockingDate = new Date(2026, 4, 31)

function StoryWrapper(args: React.ComponentProps<typeof RecipeScreen>) {
    MockDate.set(mockingDate)

    useEffect(() => () => MockDate.reset(), [])

    return <RecipeScreen {...args} />
}

const meta: Meta<typeof RecipeScreen> = {
    title: 'Screens/RecipeScreen',
    component: RecipeScreen,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    decorators: [(Story) => <Story />],
    render: (args) => <StoryWrapper {...args} />,
    args: {
        recipe: OnlineRecipeWithImage,
        dates: [
            {
                date: '2026-06-02',
                mealTime: MealTime.DINNER,
                course: Course.MAIN,
            },
            {
                date: '2026-06-09',
                mealTime: MealTime.LUNCH,
                course: Course.SIDE,
            },
        ],
        onAddMealSubmit: fn(async (values) => createMealPlanFromFormValues(values)),
        onDeleteMealSubmit: fn(async (mealPlan) => mealPlan),
    },
}

export default meta

type Story = StoryObj<typeof RecipeScreen>

export const Default: Story = {}

export const AddsMealPlanAndHighlightsClickedWeekday: Story = {
    play: async ({ canvas, userEvent, args }) => {
        const wednesdayTag = canvas.getByText(/wednesday/i).closest('[data-status]')

        expect(wednesdayTag).not.toBeNull()
        expect(wednesdayTag).toHaveAttribute('data-status', 'default')

        await userEvent.click(canvas.getByText(/wednesday/i))

        const addMealPopup = canvas.getByText(/setup meal plan for recipe/i).closest('form')

        expect(addMealPopup).not.toBeNull()

        const popup = within(addMealPopup!)

        await userEvent.selectOptions(
            popup.getByLabelText(/meal time/i, { selector: 'select' }),
            MealTime.DINNER,
        )
        await userEvent.selectOptions(
            popup.getByLabelText(/course/i, { selector: 'select' }),
            Course.MAIN,
        )
        await userEvent.click(popup.getByRole('button', { name: /next/i }))
        await userEvent.click(popup.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(args.onAddMealSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    mealDate: '2026-06-03',
                    mealTime: MealTime.DINNER,
                    course: Course.MAIN,
                    source: 'internal',
                    internalRecipeId: args.recipe.id,
                    title: args.recipe.title,
                    author: formatAuthors(args.recipe.authors),
                }),
            )
            expect(canvas.getByText(/wednesday/i).closest('[data-status]')).toHaveAttribute(
                'data-status',
                'subtle',
            )
        })
    },
}

export const DeletesMealPlanAndClearsWeekdayHighlight: Story = {
    args: {
        dates: [
            {
                date: '2026-05-25',
                mealTime: MealTime.DINNER,
                course: Course.MAIN,
            },
        ],
    },
    play: async ({ canvas, userEvent, args }) => {
        const mondayTag = canvas.getByText(/monday/i).closest('[data-status]')

        expect(mondayTag).not.toBeNull()
        expect(mondayTag).toHaveAttribute('data-status', 'highlighted')

        await userEvent.click(canvas.getByText(/monday/i))

        expect(canvas.getByText(/delete meal plan\?/i)).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /confirm/i }))

        await waitFor(() => {
            expect(args.onDeleteMealSubmit).toHaveBeenCalledWith({
                date: '2026-05-25',
                mealTime: MealTime.DINNER,
                course: Course.MAIN,
            })
            expect(canvas.queryByText(/delete meal plan\?/i)).not.toBeInTheDocument()
            expect(canvas.getByText(/monday/i).closest('[data-status]')).toHaveAttribute(
                'data-status',
                'default',
            )
        })
    },
}
