import { GetExtractedExternalRecipeResponse } from '@awjh/home-automation-v2-api-models'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Cuisine, MealType, type Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import AddRecipeScreen from './AddRecipeScreen'

const testUrl = 'https://example.com/recipe'

const extractRecipeFromOnlineSource = fn(async () => extractedRecipe)
const calculateCalories = fn(async () => ({ calories: 250, unresolvedIngredients: [] }))
const addRecipe = fn(async () => ({ id: 'recipe-1' }))
const editRecipe = fn(async () => ({ id: 'recipe-1' }))

const extractedRecipe = {
    title: 'Weeknight Lasagne',
    originalImageUrl: 'https://example.com/lasagne.jpg',
    duration: {
        prepDuration: 20,
        cookingDuration: 40,
        standingTime: 10,
    },
    ingredients: [
        {
            section: 'Main Recipe',
            ingredients: [
                {
                    quantity: 2,
                    measure: 'tbsp',
                    item: 'Olive oil',
                    preparation: 'for frying',
                },
            ],
        },
    ],
    originalSource: {
        type: SourceType.ONLINE,
        url: testUrl,
    },
    tags: {
        cuisine: [Cuisine.ITALIAN],
        mealType: [MealType.TEA],
        meat: [],
        dietary: [],
        occasion: [],
        equipment: [],
    },
    authors: ['Test Chef'],
    method: [
        {
            text: 'Brown the mince in olive oil',
            ingredients: [],
        },
    ],
    produces: {
        serves: 6,
    },
} satisfies GetExtractedExternalRecipeResponse

const recipeToEdit: Recipe = {
    id: 'recipe-1',
    title: 'Existing Recipe',
    originalSource: {
        type: SourceType.ONLINE,
        url: 'https://example.com/existing-recipe',
    },
    image: 'https://example.com/image.png',
    authors: ['Ada Lovelace'],
    calories: 250,
    duration: {
        prepDuration: 15,
        cookingDuration: 20,
        standingTime: 5,
    },
    ingredients: [
        {
            section: 'Main',
            ingredients: [
                {
                    quantity: 2,
                    measure: 'cups',
                    item: 'flour',
                    preparation: 'sifted',
                },
            ],
        },
    ],
    method: [{ text: 'Mix everything together', ingredients: [] }],
    produces: { serves: 4 },
    tags: {
        cuisine: [Cuisine.ITALIAN],
        mealType: [MealType.BREAKFAST],
        meat: [],
        dietary: [],
        occasion: [],
        equipment: [],
    },
}

const meta: Meta<typeof AddRecipeScreen> = {
    title: 'Screens/AddRecipeScreen',
    component: AddRecipeScreen,
    args: {
        calculateCalories,
        addRecipe,
        extractRecipeFromOnlineSource,
    },
}

export default meta

type Story = StoryObj<typeof AddRecipeScreen>

export const Default: Story = {}

export const EditRendersAllValuesAddsTagAndSubmits: Story = {
    args: {
        recipe: recipeToEdit,
        addRecipe: undefined,
        editRecipe,
    },
    play: async ({ canvas, userEvent, args }) => {
        editRecipe.mockClear()

        await waitFor(() => {
            expect(canvas.getByRole('textbox', { name: /url/i })).toHaveValue(
                'https://example.com/existing-recipe',
            )
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByLabelText(/recipe title/i, { selector: 'input' })).toHaveValue(
                'Existing Recipe',
            )
            expect(canvas.getByLabelText(/recipe author/i, { selector: 'input' })).toHaveValue(
                'Ada Lovelace',
            )
            expect(canvas.getByLabelText(/recipe image/i, { selector: 'input' })).toHaveValue(
                'https://example.com/image.png',
            )
            expect(canvas.getByLabelText(/cooking duration/i, { selector: 'input' })).toHaveValue(
                20,
            )
            expect(
                canvas.getByLabelText(/preparation duration/i, { selector: 'input' }),
            ).toHaveValue(15)
            expect(canvas.getByLabelText(/standing time/i, { selector: 'input' })).toHaveValue(5)
            expect(canvas.getByLabelText(/serves/i, { selector: 'input' })).toHaveValue(4)
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByDisplayValue('2')).toBeInTheDocument()
            expect(canvas.getByDisplayValue('cups')).toBeInTheDocument()
            expect(canvas.getByDisplayValue('flour')).toBeInTheDocument()
            expect(canvas.getByDisplayValue('sifted')).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByDisplayValue('Mix everything together')).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByLabelText(/calories/i, { selector: 'input' })).toHaveValue(250)
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByRole('button', { name: /^italian$/i })).toHaveAttribute(
                'data-status',
                'highlighted',
            )
            expect(canvas.getByRole('button', { name: /^breakfast$/i })).toHaveAttribute(
                'data-status',
                'highlighted',
            )
        })

        await userEvent.click(canvas.getByRole('button', { name: /^tea$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /finish/i }))

        await waitFor(() => {
            expect(args.editRecipe).toHaveBeenCalledTimes(1)
            expect(args.editRecipe).toHaveBeenCalledWith(
                'recipe-1',
                expect.objectContaining({
                    title: 'Existing Recipe',
                    originalSource: {
                        type: SourceType.ONLINE,
                        url: 'https://example.com/existing-recipe',
                    },
                    calories: 250,
                    tags: expect.objectContaining({
                        cuisine: [Cuisine.ITALIAN],
                        mealType: expect.arrayContaining([MealType.BREAKFAST, MealType.TEA]),
                    }),
                }),
            )
        })
    },
}

export const AddBookSourceLookupCaloriesAndSubmits: Story = {
    play: async ({ canvas, userEvent, args }) => {
        addRecipe.mockClear()
        calculateCalories.mockClear()

        await userEvent.selectOptions(
            canvas.getByLabelText(/where is the recipe originally from/i, { selector: 'select' }),
            'book',
        )
        await userEvent.type(
            canvas.getByLabelText(/book title/i, { selector: 'input' }),
            'One Pot Wonders',
        )
        await userEvent.type(canvas.getByLabelText(/page number/i, { selector: 'input' }), '77')
        await userEvent.type(canvas.getByLabelText(/^series$/i, { selector: 'input' }), 'Nom Nom')
        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))

        await waitFor(() => {
            expect(canvas.getByText(/basic details/i)).toBeInTheDocument()
        })

        await userEvent.type(
            canvas.getByLabelText(/recipe title/i, { selector: 'input' }),
            'Book Pie',
        )
        await userEvent.type(
            canvas.getByLabelText(/recipe author/i, { selector: 'input' }),
            'Book Chef',
        )
        await userEvent.type(
            canvas.getByLabelText(/cooking duration/i, { selector: 'input' }),
            '30',
        )
        await userEvent.type(
            canvas.getByLabelText(/preparation duration/i, { selector: 'input' }),
            '15',
        )
        await userEvent.type(canvas.getByLabelText(/standing time/i, { selector: 'input' }), '5')
        await userEvent.type(canvas.getByLabelText(/serves/i, { selector: 'input' }), '4')
        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))

        await waitFor(() => {
            expect(canvas.getByText(/add recipe ingredients/i)).toBeInTheDocument()
        })

        const ingredientInputs = canvas.getAllByRole('textbox')
        await userEvent.type(ingredientInputs[0], '2')
        await userEvent.type(ingredientInputs[2], 'Potatoes')
        await userEvent.click(ingredientInputs[2])
        await userEvent.keyboard('{Enter}')
        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))

        await waitFor(() => {
            expect(canvas.getByText(/add recipe method/i)).toBeInTheDocument()
        })

        const methodInputs = canvas.getAllByRole('textbox')
        await userEvent.type(methodInputs[0], 'Bake until golden')
        await userEvent.keyboard('{Enter}')
        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))

        await waitFor(() => {
            expect(canvas.getByLabelText(/calories/i, { selector: 'input' })).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /lookup calories/i }))
        await waitFor(() => {
            expect(args.calculateCalories).toHaveBeenCalledTimes(1)
            expect(canvas.getByLabelText(/calories/i, { selector: 'input' })).toHaveValue(250)
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByText(/add recipe tags/i)).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /^italian$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /finish/i }))

        await waitFor(() => {
            expect(args.addRecipe).toHaveBeenCalledTimes(1)
            expect(args.addRecipe).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Book Pie',
                    calories: 250,
                    originalSource: {
                        type: SourceType.BOOK,
                        title: 'One Pot Wonders',
                        page: 77,
                        series: 'Nom Nom',
                    },
                    tags: expect.objectContaining({
                        cuisine: [Cuisine.ITALIAN],
                    }),
                }),
            )
        })
    },
}

export const AddOnlineLookupAmendMethodManualCaloriesAndSubmit: Story = {
    play: async ({ canvas, userEvent, args }) => {
        addRecipe.mockClear()
        extractRecipeFromOnlineSource.mockClear()

        await userEvent.type(canvas.getByLabelText(/url/i, { selector: 'input' }), testUrl)
        await userEvent.click(canvas.getByRole('button', { name: /extract/i }))

        await waitFor(() => {
            expect(args.extractRecipeFromOnlineSource).toHaveBeenCalledWith(testUrl)
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))

        await waitFor(() => {
            expect(canvas.getByText(/add recipe method/i)).toBeInTheDocument()
            expect(canvas.getByDisplayValue('Brown the mince in olive oil')).toBeInTheDocument()
        })

        const methodInput = canvas.getByDisplayValue('Brown the mince in olive oil')
        await userEvent.clear(methodInput)
        await userEvent.type(methodInput, 'Brown gently for 8 minutes')
        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))

        await waitFor(() => {
            expect(canvas.getByLabelText(/calories/i, { selector: 'input' })).toBeInTheDocument()
        })

        const caloriesInput = canvas.getByLabelText(/calories/i, { selector: 'input' })
        await userEvent.clear(caloriesInput)
        await userEvent.type(caloriesInput, '610')
        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await userEvent.click(canvas.getByRole('button', { name: /finish/i }))

        await waitFor(() => {
            expect(args.addRecipe).toHaveBeenCalledTimes(1)
            expect(args.addRecipe).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Weeknight Lasagne',
                    calories: 610,
                    originalSource: {
                        type: SourceType.ONLINE,
                        url: testUrl,
                    },
                    method: expect.arrayContaining([
                        expect.objectContaining({
                            text: 'Brown gently for 8 minutes',
                        }),
                    ]),
                }),
            )
        })
    },
}
