import type { Meta, StoryObj } from '@storybook/react-vite'
import UpcomingMealsList, {
    UpcomingMealsListSortedTitles,
} from '@test/mockData/upcomingMeals/UpcomingMealsList'
import { expect, waitFor } from 'storybook/test'
import UpcomingMeals from './UpcomingMeals'

const meta: Meta<typeof UpcomingMeals> = {
    title: 'Features/Home/UpcomingMeals',
    component: UpcomingMeals,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        meals: UpcomingMealsList,
    },
}

export default meta
type Story = StoryObj<typeof UpcomingMeals>

const viewport = (value: 'mobile1' | 'desktop') => ({
    parameters: {
        viewport: {
            defaultViewport: value,
        },
    },
    globals: {
        viewport: {
            value,
            isRotated: false,
        },
    },
})

function getMealCards(canvasElement: HTMLElement) {
    return Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-testid="upcoming-meal"]'))
}

export const Default: Story = {
    play: async ({ canvas, canvasElement }) => {
        expect(canvas.getByRole('heading', { name: /upcoming meals/i })).toBeInTheDocument()

        const titles = getMealCards(canvasElement).map((card) => card.dataset.title)
        expect(titles).toEqual(UpcomingMealsListSortedTitles)
    },
}

export const NoUpcomingMeals: Story = {
    args: {
        meals: [],
    },
    play: async ({ canvas }) => {
        expect(canvas.getByRole('heading', { name: /upcoming meals/i })).toBeInTheDocument()
        expect(canvas.getByText(/no upcoming meals planned/i)).toBeInTheDocument()
        expect(canvas.queryByTestId('upcoming-meals-list')).not.toBeInTheDocument()
    },
}

export const WrapsIntoGridOnDesktop: Story = {
    ...viewport('desktop'),
    play: async ({ canvas, canvasElement }) => {
        const list = canvas.getByTestId('upcoming-meals-list')

        await waitFor(() => expect(getComputedStyle(list).display).toBe('grid'))

        const rowPositions = new Set(getMealCards(canvasElement).map((card) => card.offsetTop))
        expect(rowPositions.size).toBeGreaterThan(1)
        expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth)
    },
}

export const ScrollsHorizontallyOnMobile: Story = {
    ...viewport('mobile1'),
    play: async ({ canvas, canvasElement }) => {
        const list = canvas.getByTestId('upcoming-meals-list')

        await waitFor(() => expect(getComputedStyle(list).display).toBe('flex'))

        // All meals stay on one row that overflows inside the list rather than the page
        const rowPositions = new Set(getMealCards(canvasElement).map((card) => card.offsetTop))
        expect(rowPositions.size).toBe(1)
        expect(list.scrollWidth).toBeGreaterThan(list.clientWidth)
        expect(canvasElement.ownerDocument.documentElement.scrollWidth).toBeLessThanOrEqual(
            canvasElement.ownerDocument.documentElement.clientWidth,
        )

        const lastCard = getMealCards(canvasElement).at(-1)!
        lastCard.scrollIntoView({ block: 'nearest', inline: 'end' })

        await waitFor(() => expect(list.scrollLeft).toBeGreaterThan(0))
    },
}
