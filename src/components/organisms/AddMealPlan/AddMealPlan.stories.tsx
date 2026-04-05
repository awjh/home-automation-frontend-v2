import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, type Mock } from 'storybook/test'
import AddMealPlan from './AddMealPlan'

const searchInternalRecipes = fn(async ({ title, author }) => {
    const recipes = [
        {
            id: 'recipe-1',
            title: 'Spaghetti Bolognese',
            author: 'Andrew Hurt',
            duration: { prepDuration: 20, cookingDuration: 45, standingTime: 0 },
        },
        {
            id: 'recipe-2',
            title: 'Spaghetti Carbonara',
            author: 'Andrew Hurt',
            duration: { prepDuration: 10, cookingDuration: 20, standingTime: 0 },
        },
    ]

    return recipes.filter((recipe) => {
        const matchesTitle = !title || recipe.title.toLowerCase().includes(title.toLowerCase())
        const matchesAuthor = !author || recipe.author.toLowerCase().includes(author.toLowerCase())

        return matchesTitle && matchesAuthor
    })
})

const meta: Meta<typeof AddMealPlan> = {
    title: 'Organisms/AddMealPlan',
    component: AddMealPlan,
    decorators: [(Story) => <Story />],
    args: {
        date: '2026-03-31',
        onSubmit: fn().mockResolvedValue(undefined),
        searchInternalRecipes,
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlan>

export const Default: Story = {}

export const BookFlowSubmitsExpectedData: Story = {
    play: async ({ args, canvas, userEvent }) => {
        ;(args.onSubmit as Mock).mockClear()
        ;(args.searchInternalRecipes as Mock).mockClear()

        const mealTimeSelect = canvas.getByLabelText(/meal time/i, { selector: 'select' })
        const sourceSelect = canvas.getByLabelText(/source/i, { selector: 'select' })

        await userEvent.selectOptions(mealTimeSelect, MealTime.DINNER)
        await userEvent.selectOptions(sourceSelect, SourceType.BOOK)
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await userEvent.type(canvas.getByLabelText(/title/i, { selector: 'input' }), 'Traybake')
        await userEvent.type(
            canvas.getByLabelText(/author/i, { selector: 'input' }),
            'Rukmini Iyer',
        )
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await userEvent.type(
            canvas.getByLabelText(/book title/i, { selector: 'input' }),
            'The Roasting Tin',
        )
        await userEvent.type(canvas.getByLabelText(/page number/i, { selector: 'input' }), '86')
        await userEvent.type(
            canvas.getByLabelText(/series/i, { selector: 'input' }),
            'Simple Suppers',
        )
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await userEvent.type(
            canvas.getByLabelText(/preparation time/i, { selector: 'input' }),
            '15',
        )
        await userEvent.type(canvas.getByLabelText(/cooking time/i, { selector: 'input' }), '35')
        await userEvent.type(canvas.getByLabelText(/standing time/i, { selector: 'input' }), '5')
        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(args.searchInternalRecipes).not.toHaveBeenCalled()
            expect(args.onSubmit).toHaveBeenCalledWith({
                mealTime: MealTime.DINNER,
                source: SourceType.BOOK,
                title: 'Traybake',
                author: 'Rukmini Iyer',
                bookTitle: 'The Roasting Tin',
                pageNumber: '86',
                series: 'Simple Suppers',
                recipeUrl: '',
                magazineName: '',
                magazineIssue: '',
                magazinePage: '',
                internalRecipeId: '',
                prepDuration: '15',
                cookingDuration: '35',
                standingTime: '5',
            })
        })
    },
}

export const ReadyPreparedFlowUsesProducer: Story = {
    play: async ({ args, canvas, userEvent }) => {
        ;(args.onSubmit as Mock).mockClear()

        const mealTimeSelect = canvas.getByLabelText(/meal time/i, { selector: 'select' })
        const sourceSelect = canvas.getByLabelText(/source/i, { selector: 'select' })

        await userEvent.selectOptions(mealTimeSelect, MealTime.DINNER)
        await userEvent.selectOptions(sourceSelect, SourceType.READY_PREPARED)
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        expect(canvas.getByLabelText(/producer/i, { selector: 'input' })).toBeInTheDocument()

        await userEvent.type(
            canvas.getByLabelText(/^title/i, { selector: 'input' }),
            'Chicken Flatties',
        )
        await userEvent.type(canvas.getByLabelText(/producer/i, { selector: 'input' }), 'M&S')
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await userEvent.type(canvas.getByLabelText(/preparation time/i, { selector: 'input' }), '0')
        await userEvent.type(canvas.getByLabelText(/cooking time/i, { selector: 'input' }), '15')
        await userEvent.type(canvas.getByLabelText(/standing time/i, { selector: 'input' }), '0')
        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(args.onSubmit).toHaveBeenCalledWith({
                mealTime: MealTime.DINNER,
                source: SourceType.READY_PREPARED,
                title: 'Chicken Flatties',
                author: 'M&S',
                bookTitle: '',
                pageNumber: '',
                series: '',
                recipeUrl: '',
                magazineName: '',
                magazineIssue: '',
                magazinePage: '',
                internalRecipeId: '',
                prepDuration: '0',
                cookingDuration: '15',
                standingTime: '0',
            })
        })
    },
}

export const FreezerFlowSkipsAuthor: Story = {
    play: async ({ args, canvas, userEvent }) => {
        ;(args.onSubmit as Mock).mockClear()

        const mealTimeSelect = canvas.getByLabelText(/meal time/i, { selector: 'select' })
        const sourceSelect = canvas.getByLabelText(/source/i, { selector: 'select' })

        await userEvent.selectOptions(mealTimeSelect, MealTime.DINNER)
        await userEvent.selectOptions(sourceSelect, SourceType.FREEZER)
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        expect(canvas.queryByLabelText(/author/i, { selector: 'input' })).not.toBeInTheDocument()

        await userEvent.type(
            canvas.getByLabelText(/^title/i, { selector: 'input' }),
            'Chicken Satay',
        )
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await userEvent.type(canvas.getByLabelText(/preparation time/i, { selector: 'input' }), '0')
        await userEvent.type(canvas.getByLabelText(/cooking time/i, { selector: 'input' }), '5')
        await userEvent.type(canvas.getByLabelText(/standing time/i, { selector: 'input' }), '0')
        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(args.onSubmit).toHaveBeenCalledWith({
                mealTime: MealTime.DINNER,
                source: SourceType.FREEZER,
                title: 'Chicken Satay',
                author: '',
                bookTitle: '',
                pageNumber: '',
                series: '',
                recipeUrl: '',
                magazineName: '',
                magazineIssue: '',
                magazinePage: '',
                internalRecipeId: '',
                prepDuration: '0',
                cookingDuration: '5',
                standingTime: '0',
            })
        })
    },
}

export const InternalRecipeFlowSubmitsRecipeDetails: Story = {
    play: async ({ args, canvas, userEvent }) => {
        ;(args.onSubmit as Mock).mockClear()
        ;(args.searchInternalRecipes as Mock).mockClear()

        const mealTimeSelect = canvas.getByLabelText(/meal time/i, { selector: 'select' })
        const sourceSelect = canvas.getByLabelText(/source/i, { selector: 'select' })

        await userEvent.selectOptions(mealTimeSelect, MealTime.DINNER)
        await userEvent.selectOptions(sourceSelect, SourceType.INTERNAL_RECIPE)
        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await userEvent.type(
            canvas.getByLabelText(/search by author/i, { selector: 'input' }),
            'andrew',
        )
        await userEvent.click(canvas.getByRole('button', { name: /search/i }))

        await waitFor(() => {
            expect(args.searchInternalRecipes).toHaveBeenCalledWith({
                title: '',
                author: 'andrew',
            })
            expect(canvas.getByText(/spaghetti bolognese/i)).toBeInTheDocument()
            expect(canvas.getByText(/spaghetti carbonara/i)).toBeInTheDocument()
        })

        const selectButtons = canvas.getAllByRole('button', { name: /select/i })

        await userEvent.click(selectButtons[1])
        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(args.onSubmit).toHaveBeenCalledWith({
                mealTime: MealTime.DINNER,
                source: SourceType.INTERNAL_RECIPE,
                title: 'Spaghetti Carbonara',
                author: 'Andrew Hurt',
                bookTitle: '',
                pageNumber: '',
                series: '',
                recipeUrl: '',
                magazineName: '',
                magazineIssue: '',
                magazinePage: '',
                internalRecipeId: 'recipe-2',
                prepDuration: '10',
                cookingDuration: '20',
                standingTime: '0',
            })
        })
    },
}
