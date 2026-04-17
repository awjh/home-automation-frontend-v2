import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { createAddMealPlanStoryArgs } from '@test/storybookHelpers/addMealPlan/storybookFlows'
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
import AddMealPlan from './AddMealPlan'

const meta: Meta<typeof AddMealPlan> = {
    title: 'Features/MealPlanner/AddMealPlan',
    component: AddMealPlan,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div style={{ minHeight: '100vh', position: 'relative' }}>
                <Story />
            </div>
        ),
    ],
    args: {
        date: '2026-04-05',
        onClose: fn(),
        ...createAddMealPlanStoryArgs(),
    },
}

export default meta

type Story = StoryObj<typeof AddMealPlan>

export const Default: Story = {
    play: async ({ canvas, userEvent, args }) =>
        playDefaultAddMealPlanFlow(canvas, userEvent, args),
}

export const CancelOnlyOnFirstPage: Story = {
    play: async ({ canvas, userEvent, args }) =>
        playCancelOnlyOnFirstPage(canvas, userEvent, args.onClose),
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
