import { Grid } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Ingredient } from '@awjh/home-automation-v2-api-models/recipes'
import { useForm } from 'react-hook-form'
import { expect, fn, waitFor } from 'storybook/test'
import MethodField from './MethodField'

type MethodFormValues = {
    steps: {
        description: string
        ingredients: Ingredient[]
    }[]
}

function MethodFieldStory({
    isDraftRow = false,
    onDraftRowEnter,
}: {
    isDraftRow?: boolean
    onDraftRowEnter: ReturnType<typeof fn>
}) {
    const { control } = useForm<MethodFormValues>({
        defaultValues: {
            steps: [
                {
                    description: '',
                    ingredients: [],
                },
            ],
        },
        mode: 'onTouched',
    })

    return (
        <Grid templateColumns={'1fr'} gap={4} w={'md'}>
            <MethodField
                control={control}
                fieldPath={'steps.0.description'}
                fieldName={'description'}
                required={true}
                isDraftRow={isDraftRow}
                onDraftRowEnter={onDraftRowEnter}
            />
        </Grid>
    )
}

const meta: Meta<typeof MethodFieldStory> = {
    title: 'Features/Recipes/AddRecipe/MethodForm/MethodField',
    component: MethodFieldStory,
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
        args.onDraftRowEnter.mockClear()
        const input = canvas.getByRole('textbox')

        await userEvent.type(input, 'Mix ingredients')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(input).toHaveValue('Mix ingredients')
            expect(args.onDraftRowEnter).toHaveBeenCalledOnce()
        })
    },
}

export const NonDraftPreventsEnterNewLine: Story = {
    play: async ({ canvas, userEvent, args }) => {
        args.onDraftRowEnter.mockClear()
        const input = canvas.getByRole('textbox')

        await userEvent.type(input, 'Mix ingredients')
        await userEvent.keyboard('{Enter}')

        await waitFor(() => {
            expect(input).toHaveValue('Mix ingredients')
            expect(args.onDraftRowEnter).not.toHaveBeenCalled()
        })
    },
}
