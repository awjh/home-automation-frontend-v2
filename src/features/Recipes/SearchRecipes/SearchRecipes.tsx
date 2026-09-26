'use client'

import {
    GetRecipesQueryParameters,
    GetRecipesResponse,
    SearchDefs,
} from '@awjh/home-automation-v2-api-models'
import { RecipeTags } from '@awjh/home-automation-v2-api-models/recipes'
import { Box, Heading, HStack, IconButton, VStack } from '@chakra-ui/react'
import RECIPE_SEARCH_PAGE_SIZE from '@constants/RecipeSearchPageSize'
import useColorMode from '@hooks/useColorMode'
import useToaster from '@hooks/useToaster'
import { useState } from 'react'
import { LuArrowLeft, LuFilter } from 'react-icons/lu'
import SearchRecipeKeywords from './SearchRecipeKeywords/SearchRecipeKeywords'
import SearchRecipeResults from './SearchRecipeResults/SearchRecipeResults'
import SearchRecipesFilters from './SearchRecipesFilters/SearchRecipesFilters'
import TabbedContent from '@molecules/TabbedContent/TabbedContent'

export interface SearchRecipesFiltersProps {
    tags: RecipeTags
    filters: SearchDefs.RecipeFilters
    recipes: GetRecipesResponse
    loadNextRecipesPage: (
        previousRecipeId: NonNullable<GetRecipesQueryParameters['previousRecipeId']>,
    ) => Promise<GetRecipesResponse>
}

export default function SearchRecipes({
    tags,
    filters,
    recipes: firstPageRecipes,
    loadNextRecipesPage,
}: SearchRecipesFiltersProps) {
    const { keyColors } = useColorMode()
    const toaster = useToaster()
    const [loadedPages, setLoadedPages] = useState({
        firstPage: firstPageRecipes,
        recipes: firstPageRecipes,
        hasNextPage: firstPageRecipes.length === RECIPE_SEARCH_PAGE_SIZE,
    })
    const [isLoadingNextPage, setIsLoadingNextPage] = useState(false)

    // A new keyword or filter search re-renders the page with a new first page, so start over from it
    if (loadedPages.firstPage !== firstPageRecipes) {
        setLoadedPages({
            firstPage: firstPageRecipes,
            recipes: firstPageRecipes,
            hasNextPage: firstPageRecipes.length === RECIPE_SEARCH_PAGE_SIZE,
        })
    }

    const { recipes } = loadedPages

    const onLoadNextPage = async () => {
        const searchFirstPage = loadedPages.firstPage
        setIsLoadingNextPage(true)

        try {
            const nextPage = await loadNextRecipesPage(recipes[recipes.length - 1].id)

            // Drop the page if the search changed while it was loading
            setLoadedPages((current) =>
                current.firstPage === searchFirstPage
                    ? {
                          ...current,
                          recipes: [...current.recipes, ...nextPage],
                          hasNextPage: nextPage.length === RECIPE_SEARCH_PAGE_SIZE,
                      }
                    : current,
            )
        } catch {
            toaster.create({
                title: 'Failed to load more recipes',
                type: 'error',
            })
        } finally {
            setIsLoadingNextPage(false)
        }
    }
    const [displayFilters, setDisplayFilters] = useState(false)
    // Remounts the mobile TabbedContent so it resets back to its initial (Results) tab.
    const [mobileTabsResetKey, setMobileTabsResetKey] = useState(0)
    const resetMobileTabToResults = () => setMobileTabsResetKey((key) => key + 1)

    const resultsContent = (
        <SearchRecipeResults
            recipes={recipes}
            onLoadNextPage={loadedPages.hasNextPage ? onLoadNextPage : undefined}
            isLoadingNextPage={isLoadingNextPage}
        />
    )

    const filtersContent = (
        <SearchRecipesFilters
            tags={tags}
            filters={filters}
            onCancel={() => {
                setDisplayFilters(false)
                resetMobileTabToResults()
            }}
        />
    )

    return (
        <HStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            p={{ base: 0, md: 4 }}
            gap={{ base: 6, md: 4 }}
        >
            {displayFilters && (
                <Box
                    maxW="400px"
                    pr={4}
                    borderRightWidth={2}
                    borderRightColor={keyColors.primary}
                    position="relative"
                    display={{ base: 'none', md: 'flex' }}
                >
                    {filtersContent}
                    <IconButton
                        aria-label={'close-recipe-filters'}
                        color={keyColors.primary}
                        _hover={{
                            bg: keyColors.buttonHoverBg,
                            color: keyColors.secondary,
                        }}
                        background={keyColors.secondary}
                        borderColor={keyColors.primary}
                        onClick={() => setDisplayFilters(false)}
                        border={0}
                        borderRadius={0}
                        position="absolute"
                        top="0"
                        right={4}
                    >
                        <LuArrowLeft />
                    </IconButton>
                </Box>
            )}
            <VStack flex={1} alignItems="flex-start">
                <HStack w={'full'}>
                    <IconButton
                        display={{ base: 'none', md: displayFilters ? 'none' : 'inline-flex' }}
                        aria-label={'toggle-recipe-filters'}
                        color={keyColors.primary}
                        _hover={{
                            bg: keyColors.buttonHoverBg,
                            color: keyColors.secondary,
                        }}
                        background={keyColors.secondary}
                        borderWidth={2}
                        borderColor={keyColors.primary}
                        borderRadius={0}
                        onClick={() => setDisplayFilters(!displayFilters)}
                    >
                        <LuFilter />
                    </IconButton>
                    <Box flex={1}>
                        <SearchRecipeKeywords />
                    </Box>
                </HStack>
                <Box
                    display={{ base: 'block', md: 'none' }}
                    w={'full'}
                    borderTopWidth={'2px'}
                    borderColor={keyColors.primary}
                >
                    <TabbedContent
                        key={mobileTabsResetKey}
                        childrenByTab={{
                            Filters: filtersContent,
                            Results: { content: resultsContent, counter: recipes.length },
                        }}
                        initialActiveTab={'Results'}
                    />
                </Box>
                <VStack
                    display={{ base: 'none', md: 'block' }}
                    w={'full'}
                    alignItems={'flex-start'}
                >
                    <Heading as="h2" size="xl" textAlign="left" mt={4} color={keyColors.primary}>
                        Search Results ({recipes.length})
                    </Heading>
                    {resultsContent}
                </VStack>
            </VStack>
        </HStack>
    )
}
