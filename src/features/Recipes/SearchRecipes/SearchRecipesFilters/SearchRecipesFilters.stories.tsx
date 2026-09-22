import { SearchDefs } from '@awjh/home-automation-v2-api-models'
import {
    Cuisine,
    Dietary,
    Equipment,
    MealType,
    Meat,
    Occasion,
    RecipeTags,
} from '@awjh/home-automation-v2-api-models/recipes'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, type Mock, waitFor } from 'storybook/test'
import SearchRecipesFilters from './SearchRecipesFilters'

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

const meta: Meta<typeof SearchRecipesFilters> = {
    title: 'Features/Recipes/SearchRecipes/SearchRecipesFilters',
    component: SearchRecipesFilters,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        tags: tags,
        filters,
        onCancel: fn(),
    },
}

export default meta

type Story = StoryObj<typeof SearchRecipesFilters>

export const Default: Story = {}

export const LoadsValuesFromQueryParams: Story = {
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                query: [
                    [
                        'tags',
                        JSON.stringify({
                            cuisine: [tags.cuisine[0]],
                            mealType: [],
                            meat: [],
                            dietary: [],
                            occasion: [],
                            equipment: [],
                        }),
                    ],
                    [
                        'filters',
                        JSON.stringify({
                            calories: { min: 100, max: 4000 },
                            duration: {
                                prepDuration: { min: 10, max: 600 },
                                cookingDuration: { min: 20, max: 650 },
                                standingTime: { min: 30, max: 2500 },
                                totalTime: { min: 100, max: 4000 },
                            },
                            serves: { min: 2, max: 8 },
                        }),
                    ],
                ],
            },
        },
    },
    play: async ({ canvas }) => {
        const selectedCuisine = tags.cuisine[0]
        const sliders = canvas.getAllByRole('slider')

        expect(
            canvas.getByRole('button', {
                name: new RegExp(`^${selectedCuisine}$`, 'i'),
            }),
        ).toHaveAttribute('data-status', 'highlighted')
        expect(sliders[0]).toHaveAttribute('aria-valuenow', '100')
        expect(sliders[1]).toHaveAttribute('aria-valuenow', '4000')
        expect(sliders[10]).toHaveAttribute('aria-valuenow', '2')
        expect(sliders[11]).toHaveAttribute('aria-valuenow', '8')
    },
}

async function moveSlider(
    userEvent: { keyboard: (input: string) => Promise<void> },
    thumb: HTMLElement,
    key: 'ArrowRight' | 'ArrowLeft',
    times: number,
) {
    thumb.focus()

    for (let i = 0; i < times; i++) {
        await userEvent.keyboard(`{${key}}`)
    }
}

const adjustedFilters: Required<SearchDefs.RecipeFilters> = {
    calories: {
        min: 50,
        max: 4950,
    },
    duration: {
        prepDuration: filters.duration.prepDuration!,
        cookingDuration: filters.duration.cookingDuration!,
        standingTime: filters.duration.standingTime!,
        totalTime: {
            min: 100,
            max: 4220,
        },
    } satisfies Required<SearchDefs.DurationQuery>,
    serves: {
        min: 3,
        max: 95,
    },
}

async function adjustFilterSliders(
    canvas: { getAllByRole: (role: string) => HTMLElement[] },
    userEvent: {
        keyboard: (input: string) => Promise<void>
    },
) {
    const [caloriesMin, caloriesMax, , , , , , , totalTimeMin, totalTimeMax, servesMin, servesMax] =
        canvas.getAllByRole('slider')

    // calories step is 5 (range > 1000): 10 presses raises min by 50, lowers max by 50
    await moveSlider(userEvent, caloriesMin, 'ArrowRight', 10)
    await moveSlider(userEvent, caloriesMax, 'ArrowLeft', 10)
    // totalTime step is 5 (range > 1000): 20 presses raises min by 100, lowers max by 100
    await moveSlider(userEvent, totalTimeMin, 'ArrowRight', 20)
    await moveSlider(userEvent, totalTimeMax, 'ArrowLeft', 20)
    // serves step is 1 (range <= 1000): raises min by 2, lowers max by 5
    await moveSlider(userEvent, servesMin, 'ArrowRight', 2)
    await moveSlider(userEvent, servesMax, 'ArrowLeft', 5)
}

export const SubmitFilters: Story = {
    play: async ({ canvas, userEvent }) => {
        const router = getRouter()

        await adjustFilterSliders(canvas, userEvent)

        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await waitFor(() => expect(router.push).toHaveBeenCalled())

        const pushedUrl = (router.push as unknown as Mock).mock.calls.at(-1)?.[0] as string
        const resolvedUrl = new URL(pushedUrl, 'http://localhost')

        expect(resolvedUrl.searchParams.get('filters')).toBe(JSON.stringify(adjustedFilters))
    },
}

export const SubmitTagsAndFilters: Story = {
    play: async ({ canvas, userEvent }) => {
        const router = getRouter()

        const selectedMeat = tags.meat[0]
        const selectedDietary = tags.dietary[0]

        await userEvent.click(
            canvas.getByRole('button', {
                name: new RegExp(`^${selectedMeat}$`, 'i'),
            }),
        )
        await userEvent.click(
            canvas.getByRole('button', {
                name: new RegExp(`^${selectedDietary}$`, 'i'),
            }),
        )

        await adjustFilterSliders(canvas, userEvent)

        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await waitFor(() => expect(router.push).toHaveBeenCalled())

        const pushedUrl = (router.push as unknown as Mock).mock.calls.at(-1)?.[0] as string
        const resolvedUrl = new URL(pushedUrl, 'http://localhost')

        expect(resolvedUrl.searchParams.get('tags')).toBe(
            JSON.stringify({
                cuisine: [],
                mealType: [],
                meat: [selectedMeat],
                dietary: [selectedDietary],
                occasion: [],
                equipment: [],
            }),
        )
        expect(resolvedUrl.searchParams.get('filters')).toBe(JSON.stringify(adjustedFilters))
    },
}

export const SubmitTags: Story = {
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/recipes',
                query: [['keywords', 'chicken']],
            },
        },
    },
    play: async ({ canvas, userEvent }) => {
        const router = getRouter()

        const selectedCuisine = tags.cuisine[0]
        const selectedMealType = tags.mealType[0]

        await userEvent.click(
            canvas.getByRole('button', {
                name: new RegExp(`^${selectedCuisine}$`, 'i'),
            }),
        )
        await userEvent.click(
            canvas.getByRole('button', {
                name: new RegExp(`^${selectedMealType}$`, 'i'),
            }),
        )
        await userEvent.click(canvas.getByRole('button', { name: /apply filters/i }))

        await waitFor(() => expect(router.push).toHaveBeenCalled())

        const pushedUrl = (router.push as unknown as Mock).mock.calls.at(-1)?.[0] as string
        const resolvedUrl = new URL(pushedUrl, 'http://localhost')

        expect(resolvedUrl.pathname).toBe('/recipes')
        expect(resolvedUrl.searchParams.getAll('keywords')).toEqual(['chicken'])
        expect(resolvedUrl.searchParams.get('tags')).toBe(
            JSON.stringify({
                cuisine: [selectedCuisine],
                mealType: [selectedMealType],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            }),
        )
        expect(resolvedUrl.searchParams.get('filters')).toBe(JSON.stringify(filters))
    },
}

export const CancelsAndResetsValues: Story = {
    play: async ({ canvas, userEvent }) => {
        const selectedCuisine = tags.cuisine[0]

        await userEvent.click(
            canvas.getByRole('button', {
                name: new RegExp(`^${selectedCuisine}$`, 'i'),
            }),
        )

        const [caloriesMin, caloriesMax] = canvas.getAllByRole('slider')
        await moveSlider(userEvent, caloriesMin, 'ArrowRight', 10)
        await moveSlider(userEvent, caloriesMax, 'ArrowLeft', 10)

        expect(caloriesMin).toHaveAttribute('aria-valuenow', '50')
        expect(caloriesMax).toHaveAttribute('aria-valuenow', '4950')

        await userEvent.click(canvas.getByRole('button', { name: /^cancel$/i }))

        expect(caloriesMin).toHaveAttribute('aria-valuenow', '0')
        expect(caloriesMax).toHaveAttribute('aria-valuenow', '5000')
        expect(
            canvas.getByRole('button', {
                name: new RegExp(`^${selectedCuisine}$`, 'i'),
            }),
        ).toHaveAttribute('data-status', 'default')
    },
}

// TODO - need to update the search recipes story and then add cypress tests
