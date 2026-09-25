import type { Meta, StoryObj } from '@storybook/react-vite'
import UpcomingMealsList, {
    UpcomingMealsListSortedTitles,
} from '@test/mockData/upcomingMeals/UpcomingMealsList'
import { expect, waitFor, within } from 'storybook/test'
import HomeScreen from './HomeScreen'

const meta: Meta<typeof HomeScreen> = {
    title: 'Screens/HomeScreen',
    component: HomeScreen,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        upcomingMeals: UpcomingMealsList,
    },
}

export default meta
type Story = StoryObj<typeof HomeScreen>

export const Default: Story = {
    play: async ({ canvas }) => {
        expect(canvas.getByRole('heading', { name: /home automation/i })).toBeInTheDocument()
        expect(canvas.getByRole('link', { name: /recipes/i })).toHaveAttribute('href', '/recipes')
        expect(canvas.getByRole('heading', { name: /upcoming meals/i })).toBeInTheDocument()

        const cards = canvas.getAllByTestId('upcoming-meal')
        expect(cards.map((card) => card.dataset.title)).toEqual(UpcomingMealsListSortedTitles)
    },
}

export const LinksToRecipesAndExternalSources: Story = {
    play: async ({ canvas }) => {
        const internalCard = canvas
            .getAllByTestId('upcoming-meal')
            .find((card) => card.dataset.title === 'Chicken Satay')!

        expect(internalCard.closest('a')).toHaveAttribute(
            'href',
            expect.stringMatching(/^\/recipes\//),
        )

        const onlineCard = canvas
            .getAllByTestId('upcoming-meal')
            .find((card) => card.dataset.title === 'Gnocchi with Roasted Red Pepper Sauce')!

        expect(onlineCard.closest('a')).toHaveAttribute(
            'href',
            expect.stringMatching(/^https:\/\//),
        )

        const freezerCard = canvas
            .getAllByTestId('upcoming-meal')
            .find((card) => card.dataset.title === 'Frozen Beef Chilli')!

        expect(freezerCard.closest('a')).toBeNull()
    },
}

export const NoUpcomingMeals: Story = {
    args: {
        upcomingMeals: [],
    },
    play: async ({ canvas }) => {
        expect(canvas.getByText(/no upcoming meals planned/i)).toBeInTheDocument()
    },
}

export const Mobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
    globals: {
        viewport: {
            value: 'mobile1',
            isRotated: false,
        },
    },
    play: async ({ canvasElement }) => {
        const list = within(canvasElement).getByTestId('upcoming-meals-list')
        const documentElement = canvasElement.ownerDocument.documentElement

        await waitFor(() => expect(list.scrollWidth).toBeGreaterThan(list.clientWidth))
        expect(documentElement.scrollWidth).toBeLessThanOrEqual(documentElement.clientWidth)
    },
}
