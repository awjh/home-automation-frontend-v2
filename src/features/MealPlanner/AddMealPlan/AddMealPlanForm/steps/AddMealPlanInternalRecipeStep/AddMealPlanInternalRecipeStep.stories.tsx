import { Flex, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor, within } from 'storybook/test'
import { useForm } from 'react-hook-form'
import AddMealPlanInternalRecipeStep from './AddMealPlanInternalRecipeStep'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'

const searchRecipes: (keywords: string) => Promise<GetRecipesResponse> = async (keywords) => {
    const recipes: GetRecipesResponse = [
        {
            id: 'e5f2a38d-3e4d-4d07-8de0-5ff7f0972b01',
            title: 'Spaghetti Bolognese',
            authors: ['Andrew Hurt'],
            calories: 620,
            duration: { prepDuration: 20, cookingDuration: 45, standingTime: 0 },
            produces: { serves: 4 },
            tags: {
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            },
        },
        {
            id: 'a8980061-49f6-4470-afab-870d2cc85b7f',
            title: 'Spaghetti Carbonara',
            authors: ['Andrew Hurt'],
            calories: 540,
            duration: { prepDuration: 10, cookingDuration: 20, standingTime: 0 },
            produces: { serves: 4 },
            tags: {
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            },
        },
        {
            id: 'ae2058df-9953-42b4-8ff1-a97489f07f74',
            title: 'Vegetable Lasagne',
            authors: ['Nigella Lawson'],
            calories: 480,
            duration: { prepDuration: 30, cookingDuration: 50, standingTime: 10 },
            produces: { serves: 6 },
            tags: {
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            },
        },
        {
            id: '17f97f79-2363-4296-9072-8e6d86fcaee9',
            title: 'Creamy Chicken Pie',
            authors: ['Mary Berry'],
            calories: 710,
            duration: { prepDuration: 25, cookingDuration: 35, standingTime: 5 },
            produces: { serves: 4 },
            tags: {
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            },
        },
        {
            id: 'd3f0394b-24e1-4f61-b17d-cf892db5cceb',
            title: 'Spicy Meatballs',
            authors: ['Andrew Hurt'],
            calories: 590,
            duration: { prepDuration: 15, cookingDuration: 30, standingTime: 0 },
            produces: { serves: 4 },
            tags: {
                cuisine: [],
                mealType: [],
                meat: [],
                dietary: [],
                occasion: [],
                equipment: [],
            },
        },
    ]

    const normalizedKeywords = keywords.trim().toLowerCase()

    if (!normalizedKeywords) {
        return []
    }

    return recipes.filter((recipe) => {
        return [recipe.title, ...recipe.authors].some((value) =>
            value.toLowerCase().includes(normalizedKeywords),
        )
    })
}

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
                        setValue={setValue}
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
            expect(canvas.getByText(/spicy meatballs/i)).toBeInTheDocument()
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
