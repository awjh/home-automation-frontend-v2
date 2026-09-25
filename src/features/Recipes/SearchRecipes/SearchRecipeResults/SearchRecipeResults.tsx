import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'
import { Separator, VStack } from '@chakra-ui/react'
import { Fragment } from 'react'
import SearchRecipeResult from '../SearchRecipeResult/SearchRecipeResult'
import useColorMode from '@hooks/useColorMode'

export interface SearchRecipeResultsProps {
    recipes: GetRecipesResponse
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
        </VStack>
    )
}
