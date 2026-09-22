'use client'

import { GetRecipesResponse, SearchDefs } from '@awjh/home-automation-v2-api-models'
import { RecipeTags } from '@awjh/home-automation-v2-api-models/recipes'
import { Box, Heading, HStack, IconButton, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
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
}

export default function SearchRecipes({ tags, filters, recipes }: SearchRecipesFiltersProps) {
    const { keyColors } = useColorMode()
    const [displayFilters, setDisplayFilters] = useState(false)
    // Remounts the mobile TabbedContent so it resets back to its initial (Results) tab.
    const [mobileTabsResetKey, setMobileTabsResetKey] = useState(0)
    const resetMobileTabToResults = () => setMobileTabsResetKey((key) => key + 1)

    const resultsContent = <SearchRecipeResults recipes={recipes} />

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
