import type { Meta, StoryObj } from '@storybook/react-vite'
import BookMealPlanWithOptional from '@test/mockData/mealPlans/BookMealPlanWithOptional'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import LeftoversMealPlan from '@test/mockData/mealPlans/LeftoversMealPlan'
import MagazineMealPlan from '@test/mockData/mealPlans/MagazineMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import DaysMeals from './DaysMeals'
import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'

const meta: Meta<typeof DaysMeals> = {
    title: 'Organisms/DaysMeals',
    component: DaysMeals,
    decorators: [(Story) => <Story />],
    args: {
        day: new Date('2026-04-01'),
        meals: [OnlineMealPlan],
    },
}

export default meta
type Story = StoryObj<typeof DaysMeals>

export const Default: Story = {}

export const MultipleMealTimes: Story = {
    args: {
        meals: [
            OnlineMealPlan,
            {
                ...BookMealPlanWithOptional,
                mealTime: MealTime.LUNCH,
            },
        ],
    },
}

export const MultipleCourses: Story = {
    args: {
        meals: [
            OnlineMealPlan,
            {
                ...BookMealPlanWithOptional,
                course: Course.STARTER,
            },
            {
                ...LeftoversMealPlan,
                course: Course.DESSERT,
            },
        ],
    },
}

export const MultipleMealTimesAndCourses: Story = {
    args: {
        meals: [
            OnlineMealPlan,
            {
                ...BookMealPlanWithOptional,
                mealTime: MealTime.LUNCH,
                title: 'Chicken Salad',
            },
            {
                ...FreezerMealPlan,
                mealTime: MealTime.LUNCH,
                course: Course.STARTER,
            },
            {
                ...MagazineMealPlan,
                mealTime: MealTime.DINNER,
                course: Course.DESSERT,
            },
        ],
    },
}
