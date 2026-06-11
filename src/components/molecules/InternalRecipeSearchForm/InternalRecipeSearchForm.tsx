import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { Flex, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import formatAuthors from '@utils/formatAuthors'
import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'
import { useState } from 'react'

export type InternalRecipeSummary = GetRecipesResponse[number]

export interface InternalRecipeSearchProps {
    searchRecipes: (keywords: string) => Promise<GetRecipesResponse>
    selectedRecipeId?: string
    onSelectRecipe: (recipe: InternalRecipeSummary) => void
    selectionErrorMessage?: string
    initialKeywords?: string
}

export default function InternalRecipeSearchForm({
    searchRecipes,
    selectedRecipeId,
    onSelectRecipe,
    selectionErrorMessage,
    initialKeywords = '',
}: InternalRecipeSearchProps) {
    const { keyColors } = useColorMode()
    const [keywordsQuery, setKeywordsQuery] = useState(initialKeywords)
    const [results, setResults] = useState<GetRecipesResponse>([])
    const [searchError, setSearchError] = useState<string | undefined>()
    const [searchPerformed, setSearchPerformed] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    const selectedRecipe = results.find((recipe) => recipe.id === selectedRecipeId)

    const handleSearch = async () => {
        if (!keywordsQuery.trim()) {
            setSearchPerformed(false)
            setResults([])
            setSearchError('Enter keywords to search')
            return
        }

        setIsSearching(true)
        setSearchError(undefined)

        try {
            const foundRecipes = await searchRecipes(keywordsQuery.trim())

            setResults(foundRecipes)
            setSearchPerformed(true)
        } catch {
            setResults([])
            setSearchPerformed(true)
            setSearchError('Unable to search recipes right now')
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <>
            <TextInput
                type={'text'}
                label={'Search recipes'}
                required={false}
                value={keywordsQuery}
                onChange={(event) => setKeywordsQuery(event.target.value)}
            />
            <Button
                type={'button'}
                onClick={() => {
                    void handleSearch()
                }}
                loading={isSearching}
                loadingText={'Searching'}
            >
                Search
            </Button>
            {searchError && (
                <Text color={'fg.error'} fontSize={'sm'}>
                    {searchError}
                </Text>
            )}
            {searchPerformed && !searchError && results.length === 0 && (
                <Text color={'fg.error'} fontSize={'sm'}>
                    No recipes found
                </Text>
            )}
            {results.length > 0 && (
                <VStack w={'full'} alignItems={'stretch'} gap={2}>
                    {results.map((recipe) => {
                        const isSelected = selectedRecipeId === recipe.id

                        return (
                            <Flex
                                key={recipe.id}
                                borderWidth={2}
                                borderColor={
                                    isSelected ? keyColors.primary : keyColors.buttonHoverBg
                                }
                                bg={isSelected ? keyColors.subtle : 'transparent'}
                                p={3}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                                gap={3}
                            >
                                <VStack alignItems={'start'} gap={0} flex={1}>
                                    <Text color={keyColors.primary}>{recipe.title}</Text>
                                    <Text color={keyColors.primary} fontSize={'sm'}>
                                        {formatAuthors(recipe.authors)}
                                    </Text>
                                </VStack>
                                <Button
                                    type={'button'}
                                    onClick={() => {
                                        onSelectRecipe(recipe)
                                    }}
                                    colorStyle={isSelected ? 'secondary' : 'primary'}
                                    size={'sm'}
                                >
                                    {isSelected ? 'Selected' : 'Select'}
                                </Button>
                            </Flex>
                        )
                    })}
                </VStack>
            )}
            {selectedRecipe && (
                <Text color={keyColors.primary} fontSize={'sm'}>
                    Selected recipe: {selectedRecipe.title} by{' '}
                    {formatAuthors(selectedRecipe.authors)}
                </Text>
            )}
            {selectionErrorMessage && (
                <Text color={'fg.error'} fontSize={'sm'}>
                    {selectionErrorMessage}
                </Text>
            )}
        </>
    )
}
