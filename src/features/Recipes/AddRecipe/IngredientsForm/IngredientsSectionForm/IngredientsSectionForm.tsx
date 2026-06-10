import { Box, Grid, GridItem, IconButton, Text, VStack } from '@chakra-ui/react'
import AreYouSure from '@molecules/AreYouSure/AreYouSure'
import useColorMode from '@hooks/useColorMode'
import { Fragment, useState, type KeyboardEvent } from 'react'
import {
    useFieldArray,
    useWatch,
    type Control,
    type FieldArrayPath,
    type UseFormSetFocus,
    type UseFormSetValue,
    type UseFormTrigger,
} from 'react-hook-form'
import { LuLink, LuTrash } from 'react-icons/lu'
import IngredientField from './IngredientField'
import IngredientsSectionTitle from './IngredientsSectionTitle'

export type IngredientsFormIngredientsRow = {
    quantity: string
    measure: string
    item: string
    preparation: string
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
    sectionIndex: number
    sectionCount: number
    onDeleteSection: () => void
    setValue: UseFormSetValue<IngredientsFormValues>
    trigger: UseFormTrigger<IngredientsFormValues>
    setFocus: UseFormSetFocus<IngredientsFormValues>
}

// TODO need to add ability to link an ingredient via popup - can I use existing?
// Need to allow moving ingredients between sections - would drag and drop be helpful on desktop?

export default function IngredientsSectionForm({
    control,
    sectionIndex,
    sectionCount,
    onDeleteSection,
    setValue,
    trigger,
    setFocus,
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

        const rowFieldNames = [
            `${ingredientsPath}.${rowIndex}.quantity`,
            `${ingredientsPath}.${rowIndex}.measure`,
            `${ingredientsPath}.${rowIndex}.item`,
            `${ingredientsPath}.${rowIndex}.preparation`,
        ] as IngredientFieldPath[]

        const isValid = await trigger(rowFieldNames)

        if (!isValid) {
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
                    const rowValues = watchedIngredients?.[rowIndex]
                    const isDraftRowEmpty = isIngredientRowEmpty(rowValues)
                    const shouldRequireDraftRow = !isDraftRowEmpty
                    const isRequired = !isDraftRow ? true : shouldRequireDraftRow

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
                                        <IconButton
                                            type={'button'}
                                            aria-label={`link ingredient`}
                                            color={keyColors.primary}
                                            _hover={{
                                                bg: keyColors.buttonHoverBg,
                                                color: keyColors.secondary,
                                            }}
                                            background={keyColors.secondary}
                                            borderWidth={2}
                                            borderColor={keyColors.primary}
                                            borderRadius={0}
                                            onClick={() => {}}
                                            data-testid={`link-button-${sectionIndex}-${rowIndex}`}
                                        >
                                            <LuLink />
                                        </IconButton>
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
