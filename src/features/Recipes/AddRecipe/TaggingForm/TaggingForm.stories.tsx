import type { Meta, StoryObj } from '@storybook/react-vite'
import {
    Cuisine,
    Dietary,
    Equipment,
    MealType,
    Meat,
    Occasion,
    type RecipeTags,
} from '@awjh/home-automation-v2-api-models/recipes'
import { expect, fn, waitFor } from 'storybook/test'
import TaggingForm from './TaggingForm'

const onNext = fn()
const onBack = fn()

const meta: Meta<typeof TaggingForm> = {
    title: 'Features/Recipes/AddRecipe/TaggingForm',
    component: TaggingForm,
    decorators: [(Story) => <Story />],
    args: {
        onNext,
        onBack,
    },
}

export default meta
type Story = StoryObj<typeof meta>
type PlayContext = Parameters<NonNullable<Story['play']>>[0]

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
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledTimes(1)
            expect(args.onNext).toHaveBeenCalledWith({
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            } satisfies RecipeTags)
            expect(args.onBack).not.toHaveBeenCalled()
        })
    },
}

export const CanSelectSomeTagsAndSubmit: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        const [selectedCuisine] = getEnumValues<Cuisine>(Cuisine)
        const [selectedMealType] = getEnumValues<MealType>(MealType)
        const [selectedMeat] = getEnumValues<Meat>(Meat)

        await selectTag(canvas, userEvent, selectedCuisine)
        await selectTag(canvas, userEvent, selectedMealType)
        await selectTag(canvas, userEvent, selectedMeat)

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledTimes(1)
            expect(args.onNext).toHaveBeenCalledWith({
                cuisine: [selectedCuisine],
                mealType: [selectedMealType],
                meat: [selectedMeat],
                dietary: [],
                occasion: [],
                equipment: [],
            } satisfies RecipeTags)
            expect(args.onBack).not.toHaveBeenCalled()
        })
    },
}

export const CanSelectSomeTagsAndGoBack: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        const [selectedDietary] = getEnumValues<Dietary>(Dietary)
        const [selectedOccasion] = getEnumValues<Occasion>(Occasion)
        const [selectedEquipment] = getEnumValues<Equipment>(Equipment)

        await selectTag(canvas, userEvent, selectedDietary)
        await selectTag(canvas, userEvent, selectedOccasion)
        await selectTag(canvas, userEvent, selectedEquipment)

        await userEvent.click(canvas.getByRole('button', { name: /back/i }))

        await waitFor(() => {
            expect(args.onBack).toHaveBeenCalledTimes(1)
            expect(args.onNext).not.toHaveBeenCalled()
        })
    },
}

export const CanDeselectTagsBeforeSubmit: Story = {
    play: async ({ canvas, userEvent, args }) => {
        onNext.mockClear()
        onBack.mockClear()

        const [selectedCuisine] = getEnumValues<Cuisine>(Cuisine)
        const [selectedMealType] = getEnumValues<MealType>(MealType)

        await selectTag(canvas, userEvent, selectedCuisine)
        await selectTag(canvas, userEvent, selectedMealType)

        await selectTag(canvas, userEvent, selectedCuisine)
        await selectTag(canvas, userEvent, selectedMealType)

        await userEvent.click(canvas.getByRole('button', { name: /next/i }))

        await waitFor(() => {
            expect(args.onNext).toHaveBeenCalledTimes(1)
            expect(args.onNext).toHaveBeenCalledWith({
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            } satisfies RecipeTags)
            expect(args.onBack).not.toHaveBeenCalled()
        })
    },
}
