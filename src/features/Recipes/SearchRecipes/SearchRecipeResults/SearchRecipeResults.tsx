import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'
import Button from '@atoms/Button/Button'
import { Box, Separator, VStack } from '@chakra-ui/react'
import { Fragment } from 'react'
import SearchRecipeResult from '../SearchRecipeResult/SearchRecipeResult'
import useColorMode from '@hooks/useColorMode'

export interface SearchRecipeResultsProps {
    recipes: GetRecipesResponse
    // Omitted when there are no more pages to load
    onLoadNextPage?: () => void
    isLoadingNextPage?: boolean
}

export default function SearchRecipeResults(props: SearchRecipeResultsProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack w={'full'} gap={0}>
            {props.recipes.map((recipe, index) => (
                <Fragment key={`recipe-result-fragment-${recipe.id}`}>
                    <SearchRecipeResult
                        key={`recipe-result-${recipe.id}`}
                        recipe={recipe}
                        colorStyle={index % 2 === 0 ? 'primary' : 'subtle'}
                    />
                    {index != props.recipes.length - 1 && (
                        <Separator size="md" w={'full'} borderColor={keyColors.primary} />
                    )}
                </Fragment>
            ))}
            {props.onLoadNextPage && props.recipes.length > 0 && (
                <Box py={4}>
                    <Button
                        type={'button'}
                        colorStyle={'secondary'}
                        onClick={props.onLoadNextPage}
                        loading={props.isLoadingNextPage}
                        loadingText={'Loading...'}
                    >
                        Load More
                    </Button>
                </Box>
            )}
        </VStack>
    )
}
