import { Grid } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import IngredientField from './IngredientField'
import {
    createEmptyIngredient,
    type IngredientsFormValues,
} from '../IngredientsSectionForm/IngredientsSectionForm'

function IngredientFieldStory({
    isDraftRow = false,
    onDraftRowEnter,
}: {
    isDraftRow?: boolean
    onDraftRowEnter: ReturnType<typeof fn>
}) {
    const { control } = useForm<IngredientsFormValues>({
        defaultValues: {
            sections: [
                {
                    name: 'section 1',
                    ingredients: [createEmptyIngredient()],
                },
            ],
        },
        mode: 'onTouched',
    })

    return (
        <Grid templateColumns={'1fr'} gap={4} w={'sm'}>
            <IngredientField
                control={control}
                fieldPath={'sections.0.ingredients.0.quantity'}
                fieldName={'quantity'}
                required={true}
                isDraftRow={isDraftRow}
                onDraftRowEnter={onDraftRowEnter}
            />
        </Grid>
    )
}

const meta: Meta<typeof IngredientFieldStory> = {
    title: 'Features/Recipes/AddRecipe/AddRecipeForm/steps/IngredientsForm/IngredientField',
    component: IngredientFieldStory,
    args: {
        onDraftRowEnter: fn(),
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DraftRowCallsEnterHandler: Story = {
    args: {
        isDraftRow: true,
    },
    play: async ({ canvas, userEvent, args }) => {
        const input = canvas.getByRole('textbox')

        await userEvent.type(input, '2')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(input).toHaveValue('2')
            expect(args.onDraftRowEnter).toHaveBeenCalledOnce()
        })
    },
}
