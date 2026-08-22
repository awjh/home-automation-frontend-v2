import {
    Cuisine,
    MealType,
    Meat,
    type RecipeTags,
} from '@awjh/home-automation-v2-api-models/recipes'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, waitFor } from 'storybook/test'
import TaggingForm from './TaggingForm'

const onSubmitStep = fn()

const meta: Meta<typeof TaggingForm> = {
    title: 'Features/Recipes/AddRecipe/AddRecipeForm/steps/TaggingForm',
    component: TaggingForm,
    decorators: [(Story) => <Story />],
    args: {
        onSubmitStep,
    },
}

export default meta
type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

function submitCurrentForm(canvasElement: HTMLElement) {
    const form = canvasElement.querySelector('form')
    expect(form).not.toBeNull()
    fireEvent.submit(form as HTMLFormElement)
}

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getEnumValues<T extends string>(enumObject: Record<string, string>) {
    return Object.values(enumObject).filter((value): value is T => typeof value === 'string')
}

async function selectTag(
    canvas: PlayContext['canvas'],
    userEvent: PlayContext['userEvent'],
    value: string,
) {
    await userEvent.click(
        canvas.getByRole('button', {
            name: new RegExp(`^${escapeRegExp(value)}$`, 'i'),
        }),
    )
}

export const Default: Story = {}

export const CanSubmitWithoutSelectingTags: Story = {
    play: async ({ canvasElement, args }) => {
        onSubmitStep.mockClear()

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(args.onSubmitStep).toHaveBeenCalledTimes(1)
            expect(args.onSubmitStep).toHaveBeenCalledWith({
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            } satisfies RecipeTags)
        })
    },
}

export const CanSelectSomeTagsAndSubmit: Story = {
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        onSubmitStep.mockClear()

        const [selectedCuisine] = getEnumValues<Cuisine>(Cuisine)
        const [selectedMealType] = getEnumValues<MealType>(MealType)
        const [selectedMeat] = getEnumValues<Meat>(Meat)

        await selectTag(canvas, userEvent, selectedCuisine)
        await selectTag(canvas, userEvent, selectedMealType)
        await selectTag(canvas, userEvent, selectedMeat)

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(args.onSubmitStep).toHaveBeenCalledTimes(1)
            expect(args.onSubmitStep).toHaveBeenCalledWith({
                cuisine: [selectedCuisine],
                mealType: [selectedMealType],
                meat: [selectedMeat],
                dietary: [],
                occasion: [],
                equipment: [],
            } satisfies RecipeTags)
        })
    },
}

export const CanSelectSomeTagsAndGoBack: Story = {
    play: async ({ canvas, canvasElement }) => {
        expect(canvas.queryByRole('button', { name: /back/i })).not.toBeInTheDocument()
        expect(canvas.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
        submitCurrentForm(canvasElement)
    },
}

export const CanDeselectTagsBeforeSubmit: Story = {
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        onSubmitStep.mockClear()

        const [selectedCuisine] = getEnumValues<Cuisine>(Cuisine)
        const [selectedMealType] = getEnumValues<MealType>(MealType)

        await selectTag(canvas, userEvent, selectedCuisine)
        await selectTag(canvas, userEvent, selectedMealType)

        await selectTag(canvas, userEvent, selectedCuisine)
        await selectTag(canvas, userEvent, selectedMealType)

        submitCurrentForm(canvasElement)

        await waitFor(() => {
            expect(args.onSubmitStep).toHaveBeenCalledTimes(1)
            expect(args.onSubmitStep).toHaveBeenCalledWith({
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            } satisfies RecipeTags)
        })
    },
}
