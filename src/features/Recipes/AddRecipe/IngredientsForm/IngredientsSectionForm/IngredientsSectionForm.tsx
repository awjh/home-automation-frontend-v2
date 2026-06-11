import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'
import { Box, Grid, GridItem, IconButton, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import AreYouSure from '@molecules/AreYouSure/AreYouSure'
import { Fragment, useState, type KeyboardEvent } from 'react'
import {
    useFieldArray,
    useWatch,
    type Control,
    type FieldArrayPath,
    type UseFormClearErrors,
    type UseFormSetError,
    type UseFormSetFocus,
    type UseFormSetValue,
} from 'react-hook-form'
import { LuTrash } from 'react-icons/lu'
import IngredientField from './IngredientField'
import IngredientsSectionTitle from './IngredientsSectionTitle'
import LinkIngredient from './LinkIngredient'

export type IngredientsFormIngredientsRow = {
    quantity: string
    measure: string
    item: string
    preparation: string
    linkedRecipeId?: string
}

export type IngredientsFormSection = {
    name: string
    ingredients: IngredientsFormIngredientsRow[]
}

export type IngredientsFormValues = {
    sections: IngredientsFormSection[]
}

export type IngredientFieldPath =
    `sections.${number}.ingredients.${number}.${keyof IngredientsFormIngredientsRow}`

const EMPTY_INGREDIENT: IngredientsFormIngredientsRow = {
    quantity: '',
    measure: '',
    item: '',
    preparation: '',
}

export function createEmptyIngredient(): IngredientsFormIngredientsRow {
    return { ...EMPTY_INGREDIENT }
}

export function createEmptySection(sectionIndex: number): IngredientsFormSection {
    return {
        name: `section ${sectionIndex}`,
        ingredients: [createEmptyIngredient()],
    }
}

export function isIngredientRowEmpty(row?: IngredientsFormIngredientsRow) {
    if (!row) {
        return true
    }

    return Object.values(row).every((value) => value.trim() === '')
}

export function trimTrailingEmptyIngredients(ingredients: IngredientsFormIngredientsRow[]) {
    const trimmedIngredients = [...ingredients]

    while (
        trimmedIngredients.length > 0 &&
        isIngredientRowEmpty(trimmedIngredients[trimmedIngredients.length - 1])
    ) {
        trimmedIngredients.pop()
    }

    return trimmedIngredients
}

export function hasPendingDraftIngredient(ingredients: IngredientsFormIngredientsRow[]) {
    return !isIngredientRowEmpty(ingredients[ingredients.length - 1])
}

interface IngredientsSectionFormProps {
    control: Control<IngredientsFormValues>
    clearErrors: UseFormClearErrors<IngredientsFormValues>
    sectionIndex: number
    sectionCount: number
    onDeleteSection: () => void
    setError: UseFormSetError<IngredientsFormValues>
    setValue: UseFormSetValue<IngredientsFormValues>
    setFocus: UseFormSetFocus<IngredientsFormValues>
    searchInternalRecipes: (keywords: string) => Promise<GetRecipesResponse>
}

// TODO
// Need to allow moving ingredients between sections - would drag and drop be helpful on desktop?
// then make a cypress test including linking an ingredient

export default function IngredientsSectionForm({
    control,
    clearErrors,
    sectionIndex,
    sectionCount,
    onDeleteSection,
    setError,
    setValue,
    setFocus,
    searchInternalRecipes,
}: IngredientsSectionFormProps) {
    const { keyColors } = useColorMode()
    const [isDeleteSectionConfirmationOpen, setIsDeleteSectionConfirmationOpen] = useState(false)
    const ingredientsPath = `sections.${sectionIndex}.ingredients` as const
    const { append, fields, remove } = useFieldArray({
        control,
        name: ingredientsPath as FieldArrayPath<IngredientsFormValues>,
    })
    const watchedIngredients = useWatch({
        control,
        name: ingredientsPath as FieldArrayPath<IngredientsFormValues>,
    }) as IngredientsFormIngredientsRow[] | undefined

    const appendIngredientRow = () => {
        const nextIngredientIndex = fields.length

        append(createEmptyIngredient())

        window.setTimeout(() => {
            setFocus(`${ingredientsPath}.${nextIngredientIndex}.quantity` as IngredientFieldPath)
        }, 0)
    }

    const handleDraftRowEnter = async (
        event: KeyboardEvent<HTMLInputElement>,
        rowIndex: number,
    ) => {
        event.preventDefault()

        const rowValues = watchedIngredients?.[rowIndex]
        if (isIngredientRowEmpty(rowValues)) {
            return
        }

        const quantityFieldPath = `${ingredientsPath}.${rowIndex}.quantity` as IngredientFieldPath
        const itemFieldPath = `${ingredientsPath}.${rowIndex}.item` as IngredientFieldPath
        const rowFieldNames = [
            quantityFieldPath,
            `${ingredientsPath}.${rowIndex}.measure`,
            itemFieldPath,
            `${ingredientsPath}.${rowIndex}.preparation`,
        ] as IngredientFieldPath[]

        clearErrors(rowFieldNames)

        let hasValidationError = false

        if (!rowValues?.quantity.trim()) {
            setError(quantityFieldPath, {
                type: 'required',
                message: 'quantity is required',
            })
            hasValidationError = true
        }

        if (!rowValues?.item.trim()) {
            setError(itemFieldPath, {
                type: 'required',
                message: 'item is required',
            })
            hasValidationError = true
        }

        if (hasValidationError) {
            return
        }

        appendIngredientRow()
    }

    return (
        <VStack gap={4} alignItems={'stretch'}>
            <IngredientsSectionTitle
                control={control}
                sectionIndex={sectionIndex}
                setValue={setValue}
                canDeleteSection={sectionCount > 1}
                onDeleteSection={() => {
                    setIsDeleteSectionConfirmationOpen(true)
                }}
            />
            <Grid gap={4} templateColumns={'2fr 3fr 6fr 4fr auto auto'}>
                <GridItem>
                    <Text color={keyColors.primary}>Quantity</Text>
                </GridItem>
                <GridItem>
                    <Text color={keyColors.primary}>Measure</Text>
                </GridItem>
                <GridItem>
                    <Text color={keyColors.primary}>Item</Text>
                </GridItem>
                <GridItem colSpan={3}>
                    <Text color={keyColors.primary}>Preparation</Text>
                </GridItem>
                {fields.map((field, rowIndex) => {
                    const isDraftRow = rowIndex === fields.length - 1
                    const isRequired = !isDraftRow

                    return (
                        <Fragment key={field.id}>
                            <IngredientField
                                control={control}
                                fieldPath={
                                    `${ingredientsPath}.${rowIndex}.quantity` as IngredientFieldPath
                                }
                                fieldName={'quantity'}
                                required={isRequired}
                                isDraftRow={isDraftRow}
                                onDraftRowEnter={(event) => {
                                    void handleDraftRowEnter(event, rowIndex)
                                }}
                            />
                            <IngredientField
                                control={control}
                                fieldPath={
                                    `${ingredientsPath}.${rowIndex}.measure` as IngredientFieldPath
                                }
                                fieldName={'measure'}
                                required={false}
                                isDraftRow={isDraftRow}
                                onDraftRowEnter={(event) => {
                                    void handleDraftRowEnter(event, rowIndex)
                                }}
                            />
                            <IngredientField
                                control={control}
                                fieldPath={
                                    `${ingredientsPath}.${rowIndex}.item` as IngredientFieldPath
                                }
                                fieldName={'item'}
                                required={isRequired}
                                isDraftRow={isDraftRow}
                                onDraftRowEnter={(event) => {
                                    void handleDraftRowEnter(event, rowIndex)
                                }}
                            />
                            <IngredientField
                                control={control}
                                fieldPath={
                                    `${ingredientsPath}.${rowIndex}.preparation` as IngredientFieldPath
                                }
                                fieldName={'preparation'}
                                required={false}
                                isDraftRow={isDraftRow}
                                colSpan={isDraftRow ? 3 : 1}
                                onDraftRowEnter={(event) => {
                                    void handleDraftRowEnter(event, rowIndex)
                                }}
                            />
                            {isDraftRow ? null : (
                                <>
                                    <GridItem>
                                        <LinkIngredient
                                            control={control}
                                            ingredientsPath={ingredientsPath}
                                            rowIndex={rowIndex}
                                            sectionIndex={sectionIndex}
                                            hasLinkedRecipe={
                                                !!watchedIngredients?.[rowIndex]?.linkedRecipeId
                                            }
                                            searchInternalRecipes={searchInternalRecipes}
                                            setValue={setValue}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <IconButton
                                            type={'button'}
                                            aria-label={`delete ingredient`}
                                            color={keyColors.primary}
                                            _hover={{
                                                bg: keyColors.buttonHoverBg,
                                                color: keyColors.secondary,
                                            }}
                                            background={keyColors.secondary}
                                            borderWidth={2}
                                            borderColor={keyColors.primary}
                                            borderRadius={0}
                                            onClick={() => {
                                                remove(rowIndex)
                                                clearErrors(ingredientsPath)
                                            }}
                                            data-testid={`delete-button-${sectionIndex}-${rowIndex}`}
                                        >
                                            <LuTrash />
                                        </IconButton>
                                    </GridItem>
                                </>
                            )}
                        </Fragment>
                    )
                })}
            </Grid>
            {isDeleteSectionConfirmationOpen ? (
                <Box
                    position={'absolute'}
                    w={'100vw'}
                    h={'100vh'}
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                >
                    <AreYouSure
                        title={'Delete Section?'}
                        message={
                            'Are you sure you want to delete this section? This will also delete all ingredients in the section.'
                        }
                        onCancel={() => {
                            setIsDeleteSectionConfirmationOpen(false)
                        }}
                        onConfirm={() => {
                            setIsDeleteSectionConfirmationOpen(false)
                            onDeleteSection()
                        }}
                    />
                </Box>
            ) : null}
        </VStack>
    )
}
