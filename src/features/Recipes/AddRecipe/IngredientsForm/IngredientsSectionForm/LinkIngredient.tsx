import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'
import { IngredientsFormIngredientsRow, IngredientsFormValues } from './IngredientsSectionForm'
import { Control, FieldArrayPath, UseFormSetValue, useWatch } from 'react-hook-form'
import { Box, IconButton } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { LuLink } from 'react-icons/lu'
import PopupForm from '@molecules/PopupForm/PopupForm'
import InternalRecipeSearchForm from '@molecules/InternalRecipeSearchForm/InternalRecipeSearchForm'
import { useState } from 'react'

export interface LinkIngredientProps {
    control: Control<IngredientsFormValues>
    ingredientsPath: `sections.${number}.ingredients`
    rowIndex: number
    sectionIndex: number
    hasLinkedRecipe: boolean
    searchInternalRecipes: (keywords: string) => Promise<GetRecipesResponse>
    setValue: UseFormSetValue<IngredientsFormValues>
}

export default function LinkIngredient({
    control,
    ingredientsPath,
    rowIndex,
    sectionIndex,
    hasLinkedRecipe,
    searchInternalRecipes,
    setValue,
}: LinkIngredientProps) {
    const { keyColors } = useColorMode()
    const [showLinkedRecipePopupIndex, setShowLinkedRecipePopupIndex] = useState(-1)
    const watchedIngredients = useWatch({
        control,
        name: ingredientsPath as FieldArrayPath<IngredientsFormValues>,
    }) as IngredientsFormIngredientsRow[] | undefined

    return (
        <>
            <IconButton
                type={'button'}
                aria-label={`link ingredient`}
                color={keyColors.primary}
                _hover={{
                    bg: keyColors.buttonHoverBg,
                    color: keyColors.secondary,
                }}
                background={hasLinkedRecipe ? keyColors.subtle : keyColors.secondary}
                borderWidth={2}
                borderColor={keyColors.primary}
                borderRadius={0}
                onClick={() => {
                    if (hasLinkedRecipe) {
                        setValue(`${ingredientsPath}.${rowIndex}.linkedRecipeId`, undefined)
                    } else {
                        setShowLinkedRecipePopupIndex(rowIndex)
                    }
                }}
                data-testid={`link-button-${sectionIndex}-${rowIndex}`}
            >
                <LuLink />
            </IconButton>
            {showLinkedRecipePopupIndex !== -1 && (
                <Box
                    position={'absolute'}
                    w={'100vw'}
                    h={'100vh'}
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                >
                    <PopupForm
                        dataProps={{
                            testid: `internal-recipe-search-popup-${sectionIndex}`,
                        }}
                        heading={'Link Internal Recipe'}
                        onClose={() => setShowLinkedRecipePopupIndex(-1)}
                    >
                        <InternalRecipeSearchForm
                            searchRecipes={searchInternalRecipes}
                            onSelectRecipe={(recipe) => {
                                setValue(
                                    `${ingredientsPath}.${showLinkedRecipePopupIndex}.linkedRecipeId`,
                                    recipe.id,
                                )
                                setShowLinkedRecipePopupIndex(-1)
                            }}
                            initialKeywords={
                                watchedIngredients?.[showLinkedRecipePopupIndex]?.item || ''
                            }
                        />
                    </PopupForm>
                </Box>
            )}
        </>
    )
}
