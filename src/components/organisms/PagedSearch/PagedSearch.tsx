'use client'

import { Box, Heading, HStack, IconButton, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import useToaster from '@hooks/useToaster'
import SearchKeywords from '@molecules/SearchKeywords/SearchKeywords'
import TabbedContent from '@molecules/TabbedContent/TabbedContent'
import { MouseEvent, ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { LuArrowLeft, LuFilter } from 'react-icons/lu'
import { saveSearchResultsSnapshot, takeSearchResultsSnapshot } from './searchResultsSnapshot'

export interface PagedSearchResultsProps<Result> {
    results: Result[]
    // Omitted when there are no more pages to load
    onLoadNextPage?: () => void
    isLoadingNextPage: boolean
}

export interface PagedSearchProps<Result extends { id: string }> {
    // What is being searched, e.g. 'recipe', used to label the filter buttons
    itemName: string
    // Where a result links to, e.g. '/recipes/', so the loaded pages are kept when one is opened
    resultHrefPrefix: string
    pageSize: number
    firstPage: Result[]
    loadNextPage: (previousId: Result['id']) => Promise<Result[]>
    renderResults: (props: PagedSearchResultsProps<Result>) => ReactNode
    // onApply and onCancel both take a small screen back to the results
    renderFilters: (props: { onApply: () => void; onCancel: () => void }) => ReactNode
}

// A keyword search with filters beside the results on larger screens and in a tab on small ones,
// where more results are loaded a page at a time
export default function PagedSearch<Result extends { id: string }>({
    itemName,
    resultHrefPrefix,
    pageSize,
    firstPage,
    loadNextPage,
    renderResults,
    renderFilters,
}: PagedSearchProps<Result>) {
    const { keyColors } = useColorMode()
    const toaster = useToaster()
    const snapshotStorageKey = `${itemName}-search-results`
    const [loadedPages, setLoadedPages] = useState({
        firstPage,
        results: firstPage,
        hasNextPage: firstPage.length === pageSize,
    })
    const [isLoadingNextPage, setIsLoadingNextPage] = useState(false)

    // A new keyword or filter search re-renders the page with a new first page, so start over from it
    if (loadedPages.firstPage !== firstPage) {
        setLoadedPages({
            firstPage,
            results: firstPage,
            hasNextPage: firstPage.length === pageSize,
        })
    }

    const restoredScrollY = useRef<number | undefined>(undefined)

    // Coming back from a result remounts the page with only the first page, so restore what was loaded
    useLayoutEffect(() => {
        const snapshot = takeSearchResultsSnapshot(
            snapshotStorageKey,
            window.location.search,
            firstPage,
        )

        if (snapshot) {
            restoredScrollY.current = snapshot.scrollY
            setLoadedPages({
                firstPage,
                results: snapshot.results,
                hasNextPage: snapshot.hasNextPage,
            })
        }
        // Only on mount, later first pages come from a new search
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // The browser restores the scroll before the extra pages render, so scroll back once they have
    useLayoutEffect(() => {
        if (restoredScrollY.current !== undefined) {
            window.scrollTo(0, restoredScrollY.current)
            restoredScrollY.current = undefined
        }
    }, [loadedPages])

    const { results } = loadedPages
    // A full last page means there may be more to load, so the count is a lower bound
    const resultCount = `${results.length}${loadedPages.hasNextPage ? '+' : ''}`

    const onClickResultLink = (event: MouseEvent) => {
        const isResultLink = (event.target as Element).closest(`a[href^="${resultHrefPrefix}"]`)

        if (isResultLink && results.length > loadedPages.firstPage.length) {
            saveSearchResultsSnapshot(snapshotStorageKey, {
                search: window.location.search,
                results,
                hasNextPage: loadedPages.hasNextPage,
                scrollY: window.scrollY,
            })
        }
    }

    const onLoadNextPage = async () => {
        const searchFirstPage = loadedPages.firstPage
        setIsLoadingNextPage(true)

        try {
            const nextPage = await loadNextPage(results[results.length - 1].id)

            // Drop the page if the search changed while it was loading
            setLoadedPages((current) =>
                current.firstPage === searchFirstPage
                    ? {
                          ...current,
                          results: [...current.results, ...nextPage],
                          hasNextPage: nextPage.length === pageSize,
                      }
                    : current,
            )
        } catch {
            toaster.create({
                title: `Failed to load more ${itemName}s`,
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

    const resultsContent = renderResults({
        results,
        onLoadNextPage: loadedPages.hasNextPage ? onLoadNextPage : undefined,
        isLoadingNextPage,
    })

    const filtersContent = renderFilters({
        onApply: resetMobileTabToResults,
        onCancel: () => {
            setDisplayFilters(false)
            resetMobileTabToResults()
        },
    })

    return (
        <HStack
            w={'full'}
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            p={{ base: 0, md: 4 }}
            gap={{ base: 6, md: 4 }}
            onClickCapture={onClickResultLink}
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
                        aria-label={`close-${itemName}-filters`}
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
                        aria-label={`toggle-${itemName}-filters`}
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
                        <SearchKeywords />
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
                            Results: { content: resultsContent, counter: resultCount },
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
                        Search Results ({resultCount})
                    </Heading>
                    {resultsContent}
                </VStack>
            </VStack>
        </HStack>
    )
}
