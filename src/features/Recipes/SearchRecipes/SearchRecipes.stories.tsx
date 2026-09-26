import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SearchDefs } from '@awjh/home-automation-v2-api-models'
import {
    Cuisine,
    RecipeTags,
    MealType,
    Meat,
    Dietary,
    Occasion,
    Equipment,
} from '@awjh/home-automation-v2-api-models/recipes'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, fn, waitFor, type Mock } from 'storybook/test'
import SearchRecipes from './SearchRecipes'
import BookRecipe from '@test/mockData/recipes/BookRecipe'
import OnlineRecipe from '@test/mockData/recipes/OnlineRecipe'
import MagazineRecipe from '@test/mockData/recipes/MagazineRecipe'

const tags: RecipeTags = {
    cuisine: Object.values(Cuisine),
    mealType: Object.values(MealType),
    meat: Object.values(Meat),
    dietary: Object.values(Dietary),
    occasion: Object.values(Occasion),
    equipment: Object.values(Equipment),
}

const filters: Required<SearchDefs.RecipeFilters> = {
    calories: {
        min: 0,
        max: 5000,
    },
    duration: {
        prepDuration: {
            min: 0,
            max: 720, // 12 hours
        },
        cookingDuration: {
            min: 0,
            max: 720, // 12 hours
        },
        standingTime: {
            min: 0,
            max: 2880, // 48 hours
        },
        totalTime: {
            min: 0,
            max: 4320, // 72 hours
        },
    } satisfies Required<SearchDefs.DurationQuery>,
    serves: {
        min: 1,
        max: 100,
    },
}

const recipeList = [
    { ...BookRecipe, image: '/recipe.jpg' },
    { ...OnlineRecipe, image: '/recipe.jpg' },
    MagazineRecipe,
    {
        ...BookRecipe,
        id: 'recipe-4',
        title: 'Lemon Chicken Tray Bake',
        authors: ['Alex Green'],
    },
]

const meta: Meta<typeof SearchRecipes> = {
    title: 'Features/Recipes/SearchRecipes',
    component: SearchRecipes,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        tags,
        filters,
        recipes: recipeList,
        loadNextRecipesPage: fn(),
    },
}

export default meta
type Story = StoryObj<typeof SearchRecipes>

export const Default: Story = {}

const fullFirstPage = Array.from({ length: 15 }, (_, index) => ({
    ...BookRecipe,
    id: `recipe-page-1-${index}`,
    title: `First Page Recipe ${index + 1}`,
}))

const lastPage = Array.from({ length: 3 }, (_, index) => ({
    ...OnlineRecipe,
    id: `recipe-page-2-${index}`,
    title: `Last Page Recipe ${index + 1}`,
}))

export const LoadsNextPage: Story = {
    args: {
        recipes: fullFirstPage,
        loadNextRecipesPage: fn(async () => lastPage),
    },
    play: async ({ args, canvas, userEvent }) => {
        expect(canvas.getByRole('heading', { name: 'Search Results (15)' })).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /^load more$/i }))

        expect(args.loadNextRecipesPage).toHaveBeenCalledWith('recipe-page-1-14')
        await waitFor(() =>
            expect(
                canvas.getByRole('heading', { name: 'Search Results (18)' }),
            ).toBeInTheDocument(),
        )
        expect(canvas.getByRole('heading', { name: /^Last Page Recipe 3 - / })).toBeInTheDocument()
        // A short page means there is nothing left to load
        expect(canvas.queryByRole('button', { name: /^load more$/i })).not.toBeInTheDocument()
    },
}

export const HidesLoadMoreWhenFirstPageIsNotFull: Story = {
    play: async ({ canvas }) => {
        expect(canvas.queryByRole('button', { name: /^load more$/i })).not.toBeInTheDocument()
    },
}

export const TogglesFiltersAndAppliesThem: Story = {
    play: async ({ canvas, userEvent }) => {
        const router = getRouter()

        await userEvent.click(canvas.getByRole('button', { name: 'toggle-recipe-filters' }))

        const selectedCuisine = tags.cuisine[0]
        await userEvent.click(
            canvas.getByRole('button', { name: new RegExp(`^${selectedCuisine}$`, 'i') }),
        )
        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await waitFor(() => expect(router.push).toHaveBeenCalled())

        const pushedUrl = (router.push as unknown as Mock).mock.calls.at(-1)?.[0] as string
        const resolvedUrl = new URL(pushedUrl, 'http://localhost')

        expect(resolvedUrl.searchParams.get('tags')).toBe(
            JSON.stringify({
                cuisine: [selectedCuisine],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            }),
        )
        expect(canvas.getByRole('button', { name: 'close-recipe-filters' })).toBeInTheDocument()
    },
}

export const TogglesFiltersAndHidesWithArrow: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'toggle-recipe-filters' }))

        expect(canvas.getByRole('button', { name: /apply filters/i })).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: 'close-recipe-filters' }))

        expect(canvas.queryByRole('button', { name: /apply filters/i })).not.toBeInTheDocument()
        expect(canvas.getByRole('button', { name: 'toggle-recipe-filters' })).toBeInTheDocument()
    },
}

export const TogglesFiltersAndHidesWithCancel: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'toggle-recipe-filters' }))

        expect(canvas.getByRole('button', { name: /apply filters/i })).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /^cancel$/i }))

        expect(canvas.queryByRole('button', { name: /apply filters/i })).not.toBeInTheDocument()
        expect(canvas.getByRole('button', { name: 'toggle-recipe-filters' })).toBeInTheDocument()
    },
}

export const SearchesUsingKeywords: Story = {
    play: async ({ canvas, userEvent }) => {
        const router = getRouter()

        await userEvent.type(canvas.getByRole('textbox', { name: /search keywords/i }), 'chicken')
        await userEvent.click(canvas.getByRole('button', { name: /^search$/i }))

        await waitFor(() => expect(router.push).toHaveBeenCalled())

        const pushedUrl = (router.push as unknown as Mock).mock.calls.at(-1)?.[0] as string
        const resolvedUrl = new URL(pushedUrl, 'http://localhost')

        expect(resolvedUrl.searchParams.get('keywords')).toBe('chicken')
    },
}

const mobileViewport = {
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
}

export const SwitchesBetweenFiltersAndResultsTabsOnSmallScreens: Story = {
    ...mobileViewport,
    play: async ({ canvas, canvasElement, userEvent }) => {
        expect(canvasElement.querySelector('[data-active-tab="Results"]')).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /^filters$/i }))

        expect(canvasElement.querySelector('[data-active-tab="Filters"]')).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /^results/i }))

        expect(canvasElement.querySelector('[data-active-tab="Results"]')).toBeInTheDocument()
    },
}

export const CancellingFiltersOnSmallScreensReturnsToResultsTab: Story = {
    ...mobileViewport,
    play: async ({ canvas, canvasElement, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /^filters$/i }))

        expect(canvasElement.querySelector('[data-active-tab="Filters"]')).toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: /^cancel$/i }))

        await waitFor(() => {
            expect(canvasElement.querySelector('[data-active-tab="Results"]')).toBeInTheDocument()
        })
    },
}
