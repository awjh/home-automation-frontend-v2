import type { Meta, StoryObj } from '@storybook/react-vite'
import MealPlanBasicDetails from './MealPlanBasicDetails'
import MealPlan from '@defs/MealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import InternalMealPlan from '@test/mockData/mealPlans/InternalMealPlan'
import BookMealPlanWithOptional from '@test/mockData/mealPlans/BookMealPlanWithOptional'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import ReadyPreparedMealPlan from '@test/mockData/mealPlans/ReadyPreparedMealPlan'
import LeftoversMealPlan from '@test/mockData/mealPlans/LeftoversMealPlan'

const meta: Meta<typeof MealPlanBasicDetails> = {
    title: 'Atoms/MealPlanBasicDetails',
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
