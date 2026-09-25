import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import BookMealPlanMissingOptional from '@test/mockData/mealPlans/BookMealPlanMissingOptional'
import BookMealPlanWithOptional from '@test/mockData/mealPlans/BookMealPlanWithOptional'
import FreezerMealPlan from '@test/mockData/mealPlans/FreezerMealPlan'
import InternalMealPlan from '@test/mockData/mealPlans/InternalMealPlan'
import LeftoversMealPlan from '@test/mockData/mealPlans/LeftoversMealPlan'
import MagazineMealPlan from '@test/mockData/mealPlans/MagazineMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import ReadyPreparedMealPlan from '@test/mockData/mealPlans/ReadyPreparedMealPlan'
import { expect } from 'storybook/test'
import MealPlanResult from './MealPlanResult'

const internalRecipeId =
    InternalMealPlan.source.type === SourceType.INTERNAL_RECIPE
        ? InternalMealPlan.source.recipeId
        : ''

const meta: Meta<typeof MealPlanResult> = {
    title: 'Features/Home/UpcomingMeals/MealPlanResult',
    component: MealPlanResult,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    decorators: [
        (Story) => (
            <Box w={'280px'} p={4}>
                <Story />
            </Box>
        ),
    ],
    args: {
        mealPlan: { ...InternalMealPlan, image: '/recipe.jpg' },
    },
}

export default meta
type Story = StoryObj<typeof MealPlanResult>

export const InternalRecipeWithImage: Story = {
    play: async ({ canvas }) => {
        const link = canvas.getByRole('link', { name: /chicken satay/i })

        expect(link).toHaveAttribute('href', `/recipes/${internalRecipeId}`)
        expect(canvas.getByRole('img', { name: InternalMealPlan.title })).toHaveAttribute(
            'src',
            '/recipe.jpg',
        )
        expect(canvas.getByText(InternalMealPlan.author)).toBeInTheDocument()
    },
}

export const InternalRecipeWithoutImage: Story = {
    args: {
        mealPlan: InternalMealPlan,
    },
    play: async ({ canvas }) => {
        expect(canvas.getByRole('link', { name: /chicken satay/i })).toBeInTheDocument()
        expect(canvas.queryByRole('img')).not.toBeInTheDocument()
    },
}

export const OnlineSource: Story = {
    args: {
        mealPlan: OnlineMealPlan,
    },
    play: async ({ canvas }) => {
        const link = canvas.getByRole('link', { name: new RegExp(OnlineMealPlan.title, 'i') })

        expect(link).toHaveAttribute(
            'href',
            OnlineMealPlan.source.type === SourceType.ONLINE ? OnlineMealPlan.source.url : '',
        )
        expect(canvas.getByText('bbcgoodfood.com')).toBeInTheDocument()
    },
}

export const OnlineSourceWithInvalidUrl: Story = {
    args: {
        mealPlan: {
            ...OnlineMealPlan,
            source: { type: SourceType.ONLINE, url: 'not a url' },
        },
    },
    play: async ({ canvas }) => {
        expect(
            canvas.getByRole('link', { name: new RegExp(OnlineMealPlan.title, 'i') }),
        ).toBeInTheDocument()
        expect(canvas.queryByText('not a url')).not.toBeInTheDocument()
    },
}

export const BookSource: Story = {
    args: {
        mealPlan: BookMealPlanMissingOptional,
    },
    play: async ({ canvas }) => {
        const { source } = BookMealPlanMissingOptional

        expect(canvas.queryByRole('link')).not.toBeInTheDocument()
        expect(canvas.getByText(BookMealPlanMissingOptional.author)).toBeInTheDocument()

        if (source.type === SourceType.BOOK) {
            expect(canvas.getByText(`${source.title} (p. ${source.page})`)).toBeInTheDocument()
        }
    },
}

export const BookInSeriesSource: Story = {
    args: {
        mealPlan: BookMealPlanWithOptional,
    },
    play: async ({ canvas }) => {
        const { source } = BookMealPlanWithOptional

        if (source.type === SourceType.BOOK) {
            expect(
                canvas.getByText(`${source.series} - ${source.title} (p. ${source.page})`),
            ).toBeInTheDocument()
        }
    },
}

export const MagazineSource: Story = {
    args: {
        mealPlan: MagazineMealPlan,
    },
    play: async ({ canvas }) => {
        const { source } = MagazineMealPlan

        expect(canvas.queryByRole('link')).not.toBeInTheDocument()

        if (source.type === SourceType.MAGAZINE) {
            expect(
                canvas.getByText(`${source.title}, ${source.issue} (p. ${source.page})`),
            ).toBeInTheDocument()
        }
    },
}

export const FreezerSource: Story = {
    args: {
        mealPlan: FreezerMealPlan,
    },
    play: async ({ canvas }) => {
        expect(canvas.queryByRole('link')).not.toBeInTheDocument()
        expect(canvas.getByText(`${FreezerMealPlan.title} (freezer)`)).toBeInTheDocument()
    },
}

export const LeftoversSource: Story = {
    args: {
        mealPlan: LeftoversMealPlan,
    },
    play: async ({ canvas }) => {
        expect(canvas.queryByRole('link')).not.toBeInTheDocument()
        expect(canvas.getByText(`${LeftoversMealPlan.title} (leftovers)`)).toBeInTheDocument()
    },
}

export const ReadyPreparedSource: Story = {
    args: {
        mealPlan: ReadyPreparedMealPlan,
    },
    play: async ({ canvas }) => {
        expect(canvas.queryByRole('link')).not.toBeInTheDocument()
        expect(
            canvas.getByText(`${ReadyPreparedMealPlan.title} (ready prepared)`),
        ).toBeInTheDocument()
    },
}
