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
    type UseFormSetValue,
} from 'react-hook-form'
import { LuGripVertical, LuTrash } from 'react-icons/lu'
import IngredientField from '../IngredientsField/IngredientField'
import IngredientsSectionTitle from '../IngredientsSectionTitle/IngredientsSectionTitle'
import LinkIngredient from '../LinkIngredient/LinkIngredient'

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
        name: sectionIndex === 1 ? 'Main Recipe' : `section ${sectionIndex}`,
        ingredients: [],
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

interface IngredientsSectionFormProps {
    control: Control<IngredientsFormValues>
    clearErrors: UseFormClearErrors<IngredientsFormValues>
    sectionIndex: number
    sectionCount: number
    onDeleteSection: () => void
    setValue: UseFormSetValue<IngredientsFormValues>
    searchInternalRecipes: (keywords: string) => Promise<GetRecipesResponse>
    isDragMode: boolean
    draggingIngredient: {
        sectionIndex: number
        rowIndex: number
    } | null
    onDragStartIngredient: (rowIndex: number) => void
    onDragEndIngredient: () => void
    onDropIngredient: () => void
    onDraftIngredientChange: (draftIngredient: IngredientsFormIngredientsRow) => void
}

export default function IngredientsSectionForm({
    control,
    clearErrors,
    sectionIndex,
    sectionCount,
    onDeleteSection,
    setValue,
    searchInternalRecipes,
    isDragMode,
    draggingIngredient,
    onDragStartIngredient,
    onDragEndIngredient,
    onDropIngredient,
    onDraftIngredientChange,
}: IngredientsSectionFormProps) {
    const { keyColors } = useColorMode()
    const [isDeleteSectionConfirmationOpen, setIsDeleteSectionConfirmationOpen] = useState(false)
    const [draftIngredient, setDraftIngredient] = useState(createEmptyIngredient())
    const [draftErrors, setDraftErrors] = useState<
        Partial<Record<keyof IngredientsFormIngredientsRow, string>>
    >({})
    const ingredientsPath = `sections.${sectionIndex}.ingredients` as const
    const { append, fields, remove } = useFieldArray({
        control,
        name: ingredientsPath as FieldArrayPath<IngredientsFormValues>,
    })
    const watchedIngredients = useWatch({
        control,
        name: ingredientsPath as FieldArrayPath<IngredientsFormValues>,
    }) as IngredientsFormIngredientsRow[] | undefined

    const handleDraftRowEnter = async (event: KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault()

        if (isIngredientRowEmpty(draftIngredient)) {
            setDraftErrors({})
            return
        }

        const nextErrors: Partial<Record<keyof IngredientsFormIngredientsRow, string>> = {}

        if (!draftIngredient.quantity.trim()) {
            nextErrors.quantity = 'quantity is required'
        }

        if (!draftIngredient.item.trim()) {
            nextErrors.item = 'item is required'
        }

        setDraftErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        append(draftIngredient)
        setDraftIngredient(createEmptyIngredient())
        onDraftIngredientChange(createEmptyIngredient())
        setDraftErrors({})
    }

    return (
        <VStack
            gap={4}
            alignItems={'stretch'}
            p={2}
            borderWidth={isDragMode ? 2 : 0}
            borderColor={isDragMode ? keyColors.primary : 'transparent'}
            onDragOver={(event) => {
                if (!isDragMode) {
                    return
                }

                event.preventDefault()
            }}
            onDrop={(event) => {
                if (!isDragMode) {
                    return
                }

                event.preventDefault()
                onDropIngredient()
            }}
        >
            <IngredientsSectionTitle
                control={control}
                sectionIndex={sectionIndex}
                setValue={setValue}
                canDeleteSection={sectionCount > 1}
                disabled={isDragMode}
                onDeleteSection={() => {
                    setIsDeleteSectionConfirmationOpen(true)
                }}
            />
            <Grid
                gap={4}
                templateColumns={
                    isDragMode ? '2fr 3fr 6fr 4fr auto auto auto' : '2fr 3fr 6fr 4fr auto auto'
                }
            >
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
                {isDragMode ? (
                    <GridItem>
                        <Text color={keyColors.primary}>Move</Text>
                    </GridItem>
                ) : null}
                {fields.map((field, rowIndex) => {
                    const isBeingDragged =
                        isDragMode &&
                        draggingIngredient?.sectionIndex === sectionIndex &&
                        draggingIngredient.rowIndex === rowIndex

                    return (
                        <Fragment key={field.id}>
                            <IngredientField
                                control={control}
                                fieldPath={
                                    `${ingredientsPath}.${rowIndex}.quantity` as IngredientFieldPath
                                }
                                fieldName={'quantity'}
                                required={true}
                                isDraftRow={false}
                                disabled={isDragMode}
                                onDraftRowEnter={() => {}}
                            />
                            <IngredientField
                                control={control}
                                fieldPath={
                                    `${ingredientsPath}.${rowIndex}.measure` as IngredientFieldPath
                                }
                                fieldName={'measure'}
                                required={false}
                                isDraftRow={false}
                                disabled={isDragMode}
                                onDraftRowEnter={() => {}}
                            />
                            <IngredientField
                                control={control}
                                fieldPath={
                                    `${ingredientsPath}.${rowIndex}.item` as IngredientFieldPath
                                }
                                fieldName={'item'}
                                required={true}
                                isDraftRow={false}
                                disabled={isDragMode}
                                onDraftRowEnter={() => {}}
                            />
                            <IngredientField
                                control={control}
                                fieldPath={
                                    `${ingredientsPath}.${rowIndex}.preparation` as IngredientFieldPath
                                }
                                fieldName={'preparation'}
                                required={false}
                                isDraftRow={false}
                                disabled={isDragMode}
                                colSpan={1}
                                onDraftRowEnter={() => {}}
                            />
                            <GridItem>
                                <LinkIngredient
                                    control={control}
                                    ingredientsPath={ingredientsPath}
                                    rowIndex={rowIndex}
                                    sectionIndex={sectionIndex}
                                    hasLinkedRecipe={
                                        !!watchedIngredients?.[rowIndex]?.linkedRecipeId
                                    }
                                    disabled={isDragMode}
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
                                    disabled={isDragMode ? true : undefined}
                                    onClick={() => {
                                        remove(rowIndex)
                                        clearErrors(ingredientsPath)
                                    }}
                                    data-testid={`delete-button-${sectionIndex}-${rowIndex}`}
                                >
                                    <LuTrash />
                                </IconButton>
                            </GridItem>
                            {isDragMode ? (
                                <GridItem>
                                    <IconButton
                                        type={'button'}
                                        aria-label={'move ingredient'}
                                        color={keyColors.primary}
                                        _hover={{
                                            bg: keyColors.buttonHoverBg,
                                            color: keyColors.secondary,
                                        }}
                                        background={
                                            isBeingDragged ? keyColors.subtle : keyColors.secondary
                                        }
                                        borderWidth={2}
                                        borderColor={keyColors.primary}
                                        borderRadius={0}
                                        draggable={true}
                                        onDragStart={(event) => {
                                            event.dataTransfer.effectAllowed = 'move'
                                            onDragStartIngredient(rowIndex)
                                        }}
                                        onDragEnd={onDragEndIngredient}
                                        data-testid={`drag-ingredient-button-${sectionIndex}-${rowIndex}`}
                                    >
                                        <LuGripVertical />
                                    </IconButton>
                                </GridItem>
                            ) : null}
                        </Fragment>
                    )
                })}
                <IngredientField
                    fieldName={'quantity'}
                    required={false}
                    isDraftRow={true}
                    disabled={isDragMode}
                    onDraftRowEnter={(event) => {
                        void handleDraftRowEnter(event)
                    }}
                    value={draftIngredient.quantity}
                    errorMessage={draftErrors.quantity}
                    onValueChange={(value) => {
                        setDraftIngredient((currentDraft) => {
                            const nextDraft = {
                                ...currentDraft,
                                quantity: value,
                            }

                            onDraftIngredientChange(nextDraft)

                            return nextDraft
                        })
                        setDraftErrors((currentErrors) => ({
                            ...currentErrors,
                            quantity: undefined,
                        }))
                    }}
                />
                <IngredientField
                    fieldName={'measure'}
                    required={false}
                    isDraftRow={true}
                    disabled={isDragMode}
                    onDraftRowEnter={(event) => {
                        void handleDraftRowEnter(event)
                    }}
                    value={draftIngredient.measure}
                    onValueChange={(value) => {
                        setDraftIngredient((currentDraft) => {
                            const nextDraft = {
                                ...currentDraft,
                                measure: value,
                            }

                            onDraftIngredientChange(nextDraft)

                            return nextDraft
                        })
                    }}
                />
                <IngredientField
                    fieldName={'item'}
                    required={false}
                    isDraftRow={true}
                    disabled={isDragMode}
                    onDraftRowEnter={(event) => {
                        void handleDraftRowEnter(event)
                    }}
                    value={draftIngredient.item}
                    errorMessage={draftErrors.item}
                    onValueChange={(value) => {
                        setDraftIngredient((currentDraft) => {
                            const nextDraft = {
                                ...currentDraft,
                                item: value,
                            }

                            onDraftIngredientChange(nextDraft)

                            return nextDraft
                        })
                        setDraftErrors((currentErrors) => ({
                            ...currentErrors,
                            item: undefined,
                        }))
                    }}
                />
                <IngredientField
                    fieldName={'preparation'}
                    required={false}
                    isDraftRow={true}
                    disabled={isDragMode}
                    colSpan={3}
                    onDraftRowEnter={(event) => {
                        void handleDraftRowEnter(event)
                    }}
                    value={draftIngredient.preparation}
                    onValueChange={(value) => {
                        setDraftIngredient((currentDraft) => {
                            const nextDraft = {
                                ...currentDraft,
                                preparation: value,
                            }

                            onDraftIngredientChange(nextDraft)

                            return nextDraft
                        })
                    }}
                />
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
