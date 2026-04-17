import { Flex, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import AddMealPlanInternalRecipeStep, {
    SearchInternalRecipes,
} from './AddMealPlanInternalRecipeStep'
import AddMealPlanFormValues from '@features/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'

const searchRecipes: SearchInternalRecipes = async ({ title, author }) => {
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
        {
            id: 'recipe-3',
            title: 'Vegetable Lasagne',
            author: 'Nigella Lawson',
            duration: { prepDuration: 30, cookingDuration: 50, standingTime: 10 },
        },
        {
            id: 'recipe-4',
            title: 'Creamy Chicken Pie',
            author: 'Mary Berry',
            duration: { prepDuration: 25, cookingDuration: 35, standingTime: 5 },
        },
        {
            id: 'recipe-5',
            title: 'Spicy Meatballs',
            author: 'Andrew Hurt',
            duration: { prepDuration: 15, cookingDuration: 30, standingTime: 0 },
        },
    ]

    return recipes.filter((recipe) => {
        const matchesTitle = !title || recipe.title.toLowerCase().includes(title.toLowerCase())
        const matchesAuthor = !author || recipe.author.toLowerCase().includes(author.toLowerCase())

        return matchesTitle && matchesAuthor
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
    title: 'Features/AddMealPlan/AddMealPlanForm/Steps/AddMealPlanInternalRecipeStep',
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
            canvas.getByLabelText(/search by author/i, { selector: 'input' }),
            'andrew',
        )
        await userEvent.click(canvas.getByRole('button', { name: /search/i }))

        await waitFor(() => {
            expect(canvas.getByText(/spaghetti bolognese/i)).toBeInTheDocument()
            expect(canvas.getByText(/spaghetti carbonara/i)).toBeInTheDocument()
            expect(canvas.getByText(/spicy meatballs/i)).toBeInTheDocument()
        })

        const selectButtons = canvas.getAllByRole('button', { name: /select/i })

        await userEvent.click(selectButtons[1])

        await waitFor(() => {
            expect(
                canvas.getByText(/selected recipe: spaghetti carbonara by andrew hurt/i),
            ).toBeInTheDocument()
        })

        await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(submitSpy).toHaveBeenCalledTimes(1)
            expect(submitSpy).toHaveBeenCalledWith({
                mealTime: '',
                source: '',
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
                title: 'Spaghetti Carbonara',
            })
        })
    },
}
