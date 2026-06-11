import { Flex, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useState } from 'react'
import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'
import InternalRecipeSearchForm from './InternalRecipeSearchForm'
import searchRecipes from '@test/storybookHelpers/searchRecipes'

interface StoryWrapperProps {
    selectedRecipeId?: string
    selectionErrorMessage?: string
}

const onSelectRecipeSpy = fn()

function StoryWrapper({ selectedRecipeId, selectionErrorMessage }: StoryWrapperProps) {
    const [selectedId, setSelectedId] = useState(selectedRecipeId)

    return (
        <Flex p={4} maxW={'450px'}>
            <VStack w={'full'} alignItems={'stretch'} gap={4}>
                <InternalRecipeSearchForm
                    searchRecipes={searchRecipes}
                    selectedRecipeId={selectedId}
                    selectionErrorMessage={selectionErrorMessage}
                    onSelectRecipe={(recipe) => {
                        setSelectedId(recipe.id)
                        onSelectRecipeSpy(recipe)
                    }}
                />
            </VStack>
        </Flex>
    )
}

const meta: Meta<typeof InternalRecipeSearchForm> = {
    title: 'Molecules/InternalRecipeSearchForm',
    component: InternalRecipeSearchForm,
    render: (args) => <StoryWrapper {...args} />,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const RequiresKeywordsToSearch: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /search/i }))

        await waitFor(() => {
            expect(canvas.getByText(/enter keywords to search/i)).toBeInTheDocument()
        })
    },
}

export const CanSearchAndSelectRecipe: Story = {
    play: async ({ canvas, userEvent }) => {
        onSelectRecipeSpy.mockClear()

        await userEvent.type(
            canvas.getByLabelText(/search recipes/i, { selector: 'input' }),
            'andrew',
        )
        await userEvent.click(canvas.getByRole('button', { name: /search/i }))

        await waitFor(() => {
            expect(canvas.getByText(/spaghetti bolognese/i)).toBeInTheDocument()
            expect(canvas.getByText(/spaghetti carbonara/i)).toBeInTheDocument()
        })

        await userEvent.click(canvas.getAllByRole('button', { name: /select/i })[0])

        await waitFor(() => {
            expect(onSelectRecipeSpy).toHaveBeenCalledTimes(1)
            expect(onSelectRecipeSpy.mock.calls[0]?.[0]).toMatchObject({
                id: 'e5f2a38d-3e4d-4d07-8de0-5ff7f0972b01',
                title: 'Spaghetti Bolognese',
            })
            expect(
                canvas.getByText(/selected recipe: spaghetti bolognese by andrew hurt/i),
            ).toBeInTheDocument()
        })
    },
}

export const ShowsSelectionError: Story = {
    args: {
        selectionErrorMessage: 'Please select a recipe',
    },
}
