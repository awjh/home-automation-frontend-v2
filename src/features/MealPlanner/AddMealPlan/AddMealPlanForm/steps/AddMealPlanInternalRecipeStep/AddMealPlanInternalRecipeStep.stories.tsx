import { Flex, VStack } from '@chakra-ui/react'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import type { Meta, StoryObj } from '@storybook/react-vite'
import searchRecipes from '@test/storybookHelpers/searchRecipes'
import formatAuthors from '@utils/formatAuthors'
import { useForm } from 'react-hook-form'
import { expect, fn, waitFor, within } from 'storybook/test'
import AddMealPlanInternalRecipeStep from './AddMealPlanInternalRecipeStep'

interface StoryWrapperProps {
    onBack?: () => void
    onSubmit?: (values: AddMealPlanFormValues) => void
    defaultValues?: Partial<AddMealPlanFormValues>
}

function StoryWrapper({ onBack = fn(), onSubmit = fn(), defaultValues }: StoryWrapperProps) {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AddMealPlanFormValues>({
        defaultValues: {
            mealTime: '',
            source: '',
            title: '',
            author: '',
            bookTitle: '',
            pageNumber: '',
            series: '',
            recipeUrl: '',
            magazineName: '',
            magazineIssue: '',
            magazinePage: '',
            internalRecipeId: '',
            prepDuration: '',
            cookingDuration: '',
            standingTime: '',
            ...defaultValues,
        },
        mode: 'onTouched',
    })

    return (
        <Flex p={4} maxW={'450px'}>
            <form
                noValidate
                style={{ width: '100%' }}
                onSubmit={(event) => {
                    event.preventDefault()
                    void handleSubmit(onSubmit)()
                }}
            >
                <VStack w={'full'} alignItems={'start'} gap={4}>
                    <AddMealPlanInternalRecipeStep
                        control={control}
                        errors={errors}
                        onBack={onBack}
                        searchRecipes={searchRecipes}
                        onRecipeSelected={(recipe) => {
                            setValue('title', recipe.title, {
                                shouldDirty: true,
                            })
                            setValue('author', formatAuthors(recipe.authors), {
                                shouldDirty: true,
                            })
                            setValue('prepDuration', recipe.duration.prepDuration.toString(), {
                                shouldDirty: true,
                            })
                            setValue(
                                'cookingDuration',
                                recipe.duration.cookingDuration.toString(),
                                {
                                    shouldDirty: true,
                                },
                            )
                            setValue('standingTime', recipe.duration.standingTime.toString(), {
                                shouldDirty: true,
                            })
                        }}
                    />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof AddMealPlanInternalRecipeStep> = {
    title: 'Features/MealPlanner/AddMealPlan/AddMealPlanForm/Steps/AddMealPlanInternalRecipeStep',
    component: AddMealPlanInternalRecipeStep,
    render: (args) => <StoryWrapper {...args} />,
    args: {
        onBack: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AddMealPlanInternalRecipeStep>

export const Default: Story = {}

export const RequiresSelectedRecipe: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(canvas.getByText(/please select a recipe/i)).toBeInTheDocument()
        })
    },
}

const submitSpy = fn()

export const SubmitsSelectedRecipe: Story = {
    render: () => <StoryWrapper onSubmit={submitSpy} />,
    play: async ({ canvas, userEvent }) => {
        submitSpy.mockClear()

        await userEvent.type(
            canvas.getByLabelText(/search recipes/i, { selector: 'input' }),
            'andrew',
        )
        await userEvent.click(canvas.getByRole('button', { name: /search/i }))

        await waitFor(() => {
            expect(canvas.getByText(/spaghetti bolognese/i)).toBeInTheDocument()
            expect(canvas.getByText(/spaghetti carbonara/i)).toBeInTheDocument()
        })

        const spaghettiCarbonara = canvas.getByText(/spaghetti carbonara/i)
        const spaghettiCarbonaraCard = spaghettiCarbonara.closest('div')?.parentElement

        expect(spaghettiCarbonaraCard).toBeInstanceOf(HTMLElement)

        await userEvent.click(
            within(spaghettiCarbonaraCard as HTMLElement).getByRole('button', { name: /select/i }),
        )

        await waitFor(() => {
            expect(
                canvas.getByText(/selected recipe: spaghetti carbonara by andrew hurt/i),
            ).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(submitSpy).toHaveBeenCalledTimes(1)
            expect(submitSpy.mock.calls[0]?.[0]).toEqual({
                mealTime: '',
                source: '',
                author: 'Andrew Hurt',
                bookTitle: '',
                pageNumber: '',
                series: '',
                recipeUrl: '',
                magazineName: '',
                magazineIssue: '',
                magazinePage: '',
                internalRecipeId: 'a8980061-49f6-4470-afab-870d2cc85b7f',
                prepDuration: '10',
                cookingDuration: '20',
                standingTime: '0',
                title: 'Spaghetti Carbonara',
            })
        })
    },
}
