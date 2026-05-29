import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
    createAddMealPlanStoryArgs,
    playInternalRecipeFromRecipePageFlow,
} from '@test/storybookHelpers/addMealPlan/storybookFlows'
import {
    playBookFlow,
    playCancelOnlyOnFirstPage,
    playDefaultAddMealPlanFlow,
    playFreezerFlow,
    playInternalRecipeFlow,
    playInternalRecipeTitleSearchFlow,
    playLeftoversFlow,
    playMagazineFlow,
    playOnlineFlow,
    playOnlineFlowLeavingExtractedDetails,
    playReadyPreparedFlow,
} from '@test/storybookHelpers/addMealPlan/storybookFlows'
import AddMealPlanForm from './AddMealPlanForm'
import FlowSource from './defs/FlowSource'

const meta: Meta<typeof AddMealPlanForm> = {
    title: 'Features/MealPlanner/AddMealPlan/AddMealPlanForm',
    component: AddMealPlanForm,
    parameters: {
        layout: 'centered',
    },
    args: {
        flowSource: FlowSource.MEAL_PLANNER,
        isMealTimeEditable: true,
        isCourseEditable: true,
        isSourceEditable: true,
        showUseForLeftoversQuestion: true,
        onCancel: fn(),
        initialValues: { mealDate: '2026-04-05' },
        ...createAddMealPlanStoryArgs(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanForm>

export const Default: Story = {
    play: async ({ canvas, userEvent, args }) =>
        playDefaultAddMealPlanFlow(canvas, userEvent, args),
}

export const CancelOnlyOnFirstPage: Story = {
    play: async ({ canvas, userEvent, args }) =>
        playCancelOnlyOnFirstPage(canvas, userEvent, args.onCancel),
}

export const BookFlow: Story = {
    play: async ({ canvas, userEvent, args }) => playBookFlow(canvas, userEvent, args),
}

export const OnlineFlow: Story = {
    play: async ({ canvas, userEvent, args }) => playOnlineFlow(canvas, userEvent, args),
}

export const OnlineFlowLeavingExtractedDetails: Story = {
    play: async ({ canvas, userEvent, args }) =>
        playOnlineFlowLeavingExtractedDetails(canvas, userEvent, args),
}

export const MagazineFlow: Story = {
    play: async ({ canvas, userEvent, args }) => playMagazineFlow(canvas, userEvent, args),
}

export const InternalRecipeFromRecipePageFlow: Story = {
    args: {
        flowSource: FlowSource.RECIPE_PAGE,
        initialValues: {
            mealDate: '2026-04-05',
            internalRecipeId: 'pre-entered-internal-recipe-id',
            title: 'Pre-entered recipe title',
            author: 'Pre-entered recipe author',
            cookingDuration: '15',
            prepDuration: '10',
            standingTime: '5',
        },
    },
    play: async ({ canvas, userEvent, args }) =>
        playInternalRecipeFromRecipePageFlow(canvas, userEvent, args),
}

export const InternalRecipeFlow: Story = {
    play: async ({ canvas, userEvent, args }) => playInternalRecipeFlow(canvas, userEvent, args),
}

export const InternalRecipeTitleSearchFlow: Story = {
    play: async ({ canvas, userEvent, args }) =>
        playInternalRecipeTitleSearchFlow(canvas, userEvent, args),
}

export const FreezerFlow: Story = {
    play: async ({ canvas, userEvent, args }) => playFreezerFlow(canvas, userEvent, args),
}

export const LeftoversFlow: Story = {
    play: async ({ canvas, userEvent, args }) => playLeftoversFlow(canvas, userEvent, args),
}

export const ReadyPreparedFlow: Story = {
    play: async ({ canvas, userEvent, args }) => playReadyPreparedFlow(canvas, userEvent, args),
}
