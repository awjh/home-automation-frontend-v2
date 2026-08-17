import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Cuisine, MealType, type Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import AddRecipe from './AddRecipe'

const meta: Meta<typeof AddRecipe> = {
    title: 'Features/Recipes/AddRecipe/AddRecipe',
    component: AddRecipe,
    args: {
        calculateCalories: async () => ({ calories: 250, unresolvedIngredients: [] }),
        addRecipe: fn(async () => ({ id: 'recipe-1' })),
    },
}

export default meta

type Story = StoryObj<typeof meta>

type PlayContext = Parameters<NonNullable<Story['play']>>[0]

const testUrl = 'https://example.com/recipe'

async function fillOriginalSource(
    canvas: PlayContext['canvas'],
    userEvent: PlayContext['userEvent'],
) {
    await userEvent.selectOptions(
        canvas.getByLabelText(/where is the recipe originally from/i, { selector: 'select' }),
        'online',
    )
    await userEvent.type(canvas.getByLabelText(/url/i, { selector: 'input' }), testUrl)
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

async function fillBasicDetails(
    canvas: PlayContext['canvas'],
    userEvent: PlayContext['userEvent'],
) {
    await userEvent.type(
        canvas.getByLabelText(/recipe title/i, { selector: 'input' }),
        'Tomato Pasta',
    )
    await userEvent.type(
        canvas.getByLabelText(/recipe author/i, { selector: 'input' }),
        'Alice Cook',
    )
    await userEvent.type(canvas.getByLabelText(/cooking duration/i, { selector: 'input' }), '25')
    await userEvent.type(
        canvas.getByLabelText(/preparation duration/i, { selector: 'input' }),
        '10',
    )
    await userEvent.type(canvas.getByLabelText(/standing time/i, { selector: 'input' }), '5')
    await userEvent.type(canvas.getByLabelText(/serves/i, { selector: 'input' }), '4')
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

async function fillIngredients(canvas: PlayContext['canvas'], userEvent: PlayContext['userEvent']) {
    const textboxes = canvas.getAllByRole('textbox')
    await userEvent.type(textboxes[0], '2')
    await userEvent.type(textboxes[2], 'Tomatoes')
    await userEvent.click(textboxes[2])
    await userEvent.keyboard('{Enter}')
    await waitFor(() => {
        expect(canvas.getAllByRole('textbox')).toHaveLength(8)
    })
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

async function fillMethods(canvas: PlayContext['canvas'], userEvent: PlayContext['userEvent']) {
    const inputs = canvas.getAllByRole('textbox')
    await userEvent.type(inputs[0], 'Boil the pasta')
    await userEvent.keyboard('{Enter}')
    await waitFor(() => {
        expect(canvas.getByDisplayValue('Boil the pasta')).toBeInTheDocument()
    })
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

async function fillCalories(canvas: PlayContext['canvas'], userEvent: PlayContext['userEvent']) {
    await userEvent.clear(canvas.getByLabelText(/calories/i, { selector: 'input' }))
    await userEvent.type(canvas.getByLabelText(/calories/i, { selector: 'input' }), '420')
    await userEvent.click(canvas.getByRole('button', { name: /next/i }))
}

async function fillTags(canvas: PlayContext['canvas'], userEvent: PlayContext['userEvent']) {
    await userEvent.click(canvas.getByRole('button', { name: /^italian$/i }))
    await userEvent.click(canvas.getByRole('button', { name: /^tea$/i }))
    await userEvent.click(canvas.getByRole('button', { name: /finish/i }))
}

export const CanCompleteFullWizardFlow: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await fillOriginalSource(canvas, userEvent)
        await fillBasicDetails(canvas, userEvent)
        await fillIngredients(canvas, userEvent)
        await fillMethods(canvas, userEvent)
        await fillCalories(canvas, userEvent)
        await fillTags(canvas, userEvent)

        await waitFor(() => {
            expect(args.addRecipe).toHaveBeenCalledTimes(1)
            expect(args.addRecipe).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Tomato Pasta',
                    calories: 420,
                    originalSource: expect.objectContaining({
                        type: SourceType.ONLINE,
                        url: testUrl,
                    }),
                }),
            )
        })
    },
}

export const CanGoBackAndForthAcrossSteps: Story = {
    play: async ({ canvas, userEvent }) => {
        await fillOriginalSource(canvas, userEvent)

        await userEvent.click(canvas.getByRole('button', { name: /back/i }))
        await waitFor(() => {
            expect(canvas.getByText(/original source/i)).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))
        await waitFor(() => {
            expect(canvas.getByText(/basic details/i)).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /back/i }))
        await waitFor(() => {
            expect(canvas.getByText(/original source/i)).toBeInTheDocument()
            expect(canvas.getByRole('textbox', { name: /url/i })).toHaveValue(testUrl)
        })

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await fillBasicDetails(canvas, userEvent)
        await fillIngredients(canvas, userEvent)
        await fillMethods(canvas, userEvent)
        await fillCalories(canvas, userEvent)
        await fillTags(canvas, userEvent)
    },
}

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

export const CanPrefillFromExistingRecipe: Story = {
    args: {
        recipe: recipeToEdit,
    },
    play: async ({ canvas, userEvent }) => {
        await waitFor(() => {
            expect(canvas.getByRole('textbox', { name: /url/i })).toHaveValue(
                'https://example.com/existing-recipe',
            )
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByText(/basic details/i)).toBeInTheDocument()
        })
        await waitFor(() => {
            expect(canvas.getByLabelText(/recipe title/i, { selector: 'input' })).toHaveValue(
                'Existing Recipe',
            )
            expect(canvas.getByLabelText(/recipe author/i, { selector: 'input' })).toHaveValue(
                'Ada Lovelace',
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
            expect(canvas.getByText(/add recipe ingredients/i)).toBeInTheDocument()
        })
        await waitFor(() => {
            expect(canvas.getByDisplayValue('2')).toBeInTheDocument()
            expect(canvas.getByDisplayValue('cups')).toBeInTheDocument()
            expect(canvas.getByDisplayValue('flour')).toBeInTheDocument()
            expect(canvas.getByDisplayValue('sifted')).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByText(/add recipe method/i)).toBeInTheDocument()
        })
        await waitFor(() => {
            expect(canvas.getByDisplayValue('Mix everything together')).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByLabelText(/calories/i, { selector: 'input' })).toBeInTheDocument()
        })
        await waitFor(() => {
            expect(canvas.getByLabelText(/calories/i, { selector: 'input' })).toHaveValue(250)
        })

        await userEvent.click(canvas.getByRole('button', { name: /^next$/i }))
        await waitFor(() => {
            expect(canvas.getByText(/add recipe tags/i)).toBeInTheDocument()
        })
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
    },
}
