import type { Meta, StoryObj } from '@storybook/react-vite'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import BookMealPlanWithOptional from '@test/mockData/mealPlans/BookMealPlanWithOptional'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import InternalMealPlan from '@test/mockData/mealPlans/InternalMealPlan'
import LeftoversMealPlan from '@test/mockData/mealPlans/LeftoversMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import ReadyPreparedMealPlan from '@test/mockData/mealPlans/ReadyPreparedMealPlan'
import MealPlanBasicDetails from './MealPlanBasicDetails'

const meta: Meta<typeof MealPlanBasicDetails> = {
    title: 'Features/MealPlanner/ViewMealPlans/MealPlanBasicDetails',
    component: MealPlanBasicDetails,
    decorators: [(Story) => <Story />],
    args: {
        mealPlan: InternalMealPlan,
    },
}

export default meta
type Story = StoryObj<typeof MealPlanBasicDetails>

export const OnlineSource: Story = {
    args: {
        mealPlan: OnlineMealPlan,
    },
}

export const InternalSource: Story = {
    args: {
        mealPlan: InternalMealPlan,
    },
}

export const BookSource: Story = {
    args: {
        mealPlan: BookMealPlanMissingOptional,
    },
}

export const BookInSeriesSource: Story = {
    args: {
        mealPlan: BookMealPlanWithOptional,
    },
}

export const FreezerSource: Story = {
    args: {
        mealPlan: FreezerMealPlan,
    },
}

export const ReadyPreparedSource: Story = {
    args: {
        mealPlan: ReadyPreparedMealPlan,
    },
}

export const LeftoversSource: Story = {
    args: {
        mealPlan: LeftoversMealPlan,
    },
}
