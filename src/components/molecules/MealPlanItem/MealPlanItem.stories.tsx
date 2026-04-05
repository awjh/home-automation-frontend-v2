import { Flex } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import BookMealPlanWithOptional from '@test/mockData/mealPlans/BookMealPlanWithOptional'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import InternalMealPlan from '@test/mockData/mealPlans/InternalMealPlan'
import LeftoversMealPlan from '@test/mockData/mealPlans/LeftoversMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import ReadyPreparedMealPlan from '@test/mockData/mealPlans/ReadyPreparedMealPlan'
import MealPlanItem from './MealPlanItem'

const meta: Meta<typeof MealPlanItem> = {
    title: 'Molecules/MealPlanItem',
    component: MealPlanItem,
    decorators: [
        (Story) => (
            <Flex w="full">
                <Story />
            </Flex>
        ),
    ],
    args: {
        mealPlan: InternalMealPlan,
    },
}

export default meta
type Story = StoryObj<typeof MealPlanItem>

export const Default: Story = {}

export const OnlineSource: Story = {
    args: {
        mealPlan: OnlineMealPlan,
    },
}

export const Book: Story = {
    args: {
        mealPlan: BookMealPlanMissingOptional,
    },
}

export const BookInSeries: Story = {
    args: {
        mealPlan: BookMealPlanWithOptional,
    },
}

export const Freezer: Story = {
    args: {
        mealPlan: FreezerMealPlan,
    },
}

export const ReadyPrepared: Story = {
    args: {
        mealPlan: ReadyPreparedMealPlan,
    },
}

export const Leftovers: Story = {
    args: {
        mealPlan: LeftoversMealPlan,
    },
}

export const LastItem: Story = {
    args: {
        mealPlan: OnlineMealPlan,
        lastItem: true,
    },
}
