import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { Ingredient } from '@awjh/home-automation-v2-api-models/recipes'
import { Box, HStack, IconButton, Text, VStack, chakra } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import PopupForm from '@molecules/PopupForm/PopupForm'
import { useMemo, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { LuTrash } from 'react-icons/lu'
import {
    type IngredientsFormSection,
    type IngredientsFormIngredientsRow,
    isIngredientRowEmpty,
} from '../../IngredientsForm/IngredientsSectionForm/IngredientsSectionForm'

type IngredientSourceOption = {
    key: string
    sectionName: string
    label: string
    ingredient: IngredientsFormIngredientsRow
}

type MethodIngredientRowFormValue = {
    sourceKey: string
    quantity: string
    measure: string
}

type MethodIngredientsPopupFormValues = {
    ingredients: MethodIngredientRowFormValue[]
}

interface MethodIngredientsPopupProps {
    stepIndex: number
    ingredientSections: IngredientsFormSection[]
    initialIngredients: Ingredient[]
    onSave: (ingredients: Ingredient[]) => void
    onCancel: () => void
}

function toIngredientLabel(ingredient: IngredientsFormIngredientsRow) {
    const item = ingredient.item.trim()
    const preparation = ingredient.preparation.trim()

    return preparation ? `${item}, ${preparation}` : item
}

function buildIngredientSourceOptions(
    ingredientSections: IngredientsFormSection[],
): IngredientSourceOption[] {
    return ingredientSections.flatMap((section, sectionIndex) =>
        section.ingredients
            .filter((ingredient) => !isIngredientRowEmpty(ingredient))
            .map((ingredient, ingredientIndex) => ({
                key: `section-${sectionIndex}-ingredient-${ingredientIndex}`,
                sectionName: section.name,
                label: toIngredientLabel(ingredient),
                ingredient,
            })),
    )
}

function toMethodIngredientRow(
    sourceKey: string,
    sourceByKey: Map<string, IngredientSourceOption>,
): MethodIngredientRowFormValue {
    const sourceOption = sourceByKey.get(sourceKey)

    return {
        sourceKey,
        quantity: sourceOption?.ingredient.quantity ?? '',
        measure: sourceOption?.ingredient.measure ?? '',
    }
}

function normalizeValue(value?: string | number) {
    if (value === undefined || value === null) {
        return ''
    }

    return String(value)
}

function normalizeNumericQuantity(value: string | number | undefined) {
    const asNumber = Number(value)

    if (Number.isNaN(asNumber)) {
        return undefined
    }

    return asNumber
}

export default function MethodIngredientsPopup({
    stepIndex,
    ingredientSections,
    initialIngredients,
    onSave,
    onCancel,
}: MethodIngredientsPopupProps) {
    const { keyColors } = useColorMode()
    const ingredientSourceOptions = useMemo(
        () => buildIngredientSourceOptions(ingredientSections),
        [ingredientSections],
    )

    const sourceByKey = useMemo(() => {
        return new Map(ingredientSourceOptions.map((option) => [option.key, option]))
    }, [ingredientSourceOptions])

    const defaultIngredients = useMemo(() => {
        const usedSourceKeys = new Set<string>()

        return initialIngredients
            .map((ingredient) => {
                const matchingSource = ingredientSourceOptions.find((option) => {
                    if (usedSourceKeys.has(option.key)) {
                        return false
                    }

                    const itemMatches = option.ingredient.item.trim() === ingredient.item.trim()
                    const preparationMatches =
                        option.ingredient.preparation.trim() ===
                        normalizeValue(ingredient.preparation).trim()

                    return itemMatches && preparationMatches
                })

                if (!matchingSource) {
                    return undefined
                }

                usedSourceKeys.add(matchingSource.key)

                return {
                    sourceKey: matchingSource.key,
                    quantity: normalizeValue(ingredient.quantity),
                    measure: normalizeValue(ingredient.measure),
                }
            })
            .filter((row): row is MethodIngredientRowFormValue => !!row)
    }, [initialIngredients, ingredientSourceOptions])

    const { control, getValues, setValue } = useForm<MethodIngredientsPopupFormValues>({
        defaultValues: {
            ingredients: defaultIngredients,
        },
        mode: 'onTouched',
    })

    const { append, fields, remove } = useFieldArray({
        control,
        name: 'ingredients',
    })
    const watchedIngredients = useWatch({ control, name: 'ingredients' }) as
        | MethodIngredientRowFormValue[]
        | undefined

    const [draftSourceKey, setDraftSourceKey] = useState('')

    const groupedOptions = useMemo(() => {
        return ingredientSourceOptions.reduce<Record<string, IngredientSourceOption[]>>(
            (acc, option) => {
                if (!acc[option.sectionName]) {
                    acc[option.sectionName] = []
                }

                acc[option.sectionName].push(option)
                return acc
            },
            {},
        )
    }, [ingredientSourceOptions])
    const hasSavedRows = fields.length > 0

    const buildSavedIngredients = () => {
        const rows = getValues('ingredients')

        return rows
            .map((row) => {
                const source = sourceByKey.get(row.sourceKey)

                if (!source) {
                    return undefined
                }

                const quantity =
                    normalizeNumericQuantity(row.quantity) ??
                    normalizeNumericQuantity(source.ingredient.quantity)

                if (quantity === undefined) {
                    return undefined
                }

                return {
                    item: source.ingredient.item,
                    preparation: source.ingredient.preparation || undefined,
                    quantity,
                    measure: row.measure || undefined,
                    internalRecipe: source.ingredient.linkedRecipeId
                        ? {
                              recipeId: source.ingredient.linkedRecipeId,
                          }
                        : undefined,
                } as Ingredient
            })
            .filter((ingredient): ingredient is Ingredient => !!ingredient)
    }

    return (
        <Box position={'absolute'} w={'100vw'} h={'100vh'} top={0} left={0} right={0} bottom={0}>
            <PopupForm
                dataProps={{ testid: `method-ingredients-popup-${stepIndex}` }}
                heading={`Ingredients for step ${stepIndex + 1}`}
                maxW={'850px'}
                onClose={onCancel}
            >
                <VStack alignItems={'stretch'} gap={4} w={'full'}>
                    <HStack gap={2} alignItems={'end'} w={'full'}>
                        <Text color={keyColors.primary} flex={3}>
                            Ingredient
                        </Text>
                        {hasSavedRows ? (
                            <>
                                <Text color={keyColors.primary} flex={1}>
                                    Quantity
                                </Text>
                                <Text color={keyColors.primary} flex={1}>
                                    Measure
                                </Text>
                                <Box minW={'10'} />
                            </>
                        ) : null}
                    </HStack>

                    {fields.map((field, index) => {
                        const watchedRow = watchedIngredients?.[index]

                        return (
                            <HStack key={field.id} gap={2} alignItems={'end'} w={'full'}>
                                <Box flex={3}>
                                    <chakra.select
                                        value={watchedRow?.sourceKey ?? field.sourceKey}
                                        borderWidth={2}
                                        borderColor={keyColors.primary}
                                        borderRadius={0}
                                        color={keyColors.primary}
                                        bg={keyColors.subtle}
                                        px={2}
                                        h={'10'}
                                        w={'full'}
                                        aria-label={`ingredient-${index}`}
                                        onChange={(event) => {
                                            const nextSourceKey = event.target.value
                                            setValue(
                                                `ingredients.${index}.sourceKey`,
                                                nextSourceKey,
                                            )
                                            const nextRow = toMethodIngredientRow(
                                                nextSourceKey,
                                                sourceByKey,
                                            )
                                            setValue(
                                                `ingredients.${index}.quantity`,
                                                nextRow.quantity,
                                            )
                                            setValue(
                                                `ingredients.${index}.measure`,
                                                nextRow.measure,
                                            )
                                        }}
                                    >
                                        <option value="">Select ingredient</option>
                                        {Object.entries(groupedOptions).map(
                                            ([sectionName, options]) => (
                                                <optgroup key={sectionName} label={sectionName}>
                                                    {options.map((option) => (
                                                        <option key={option.key} value={option.key}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ),
                                        )}
                                    </chakra.select>
                                </Box>
                                <Box flex={1}>
                                    <TextInput
                                        type={'text'}
                                        required={false}
                                        value={watchedRow?.quantity ?? field.quantity}
                                        onChange={(event) => {
                                            setValue(
                                                `ingredients.${index}.quantity`,
                                                event.target.value,
                                            )
                                        }}
                                    />
                                </Box>
                                <Box flex={1}>
                                    <TextInput
                                        type={'text'}
                                        required={false}
                                        value={watchedRow?.measure ?? field.measure}
                                        onChange={(event) => {
                                            setValue(
                                                `ingredients.${index}.measure`,
                                                event.target.value,
                                            )
                                        }}
                                    />
                                </Box>
                                <Box w={'10'} minW={'10'}>
                                    <IconButton
                                        type={'button'}
                                        aria-label={'delete method ingredient'}
                                        color={keyColors.primary}
                                        _hover={{
                                            bg: keyColors.buttonHoverBg,
                                            color: keyColors.secondary,
                                        }}
                                        background={keyColors.subtle}
                                        borderWidth={2}
                                        borderColor={keyColors.primary}
                                        borderRadius={0}
                                        w={'10'}
                                        h={'10'}
                                        onClick={() => {
                                            remove(index)
                                        }}
                                    >
                                        <LuTrash />
                                    </IconButton>
                                </Box>
                            </HStack>
                        )
                    })}

                    <HStack gap={2} alignItems={'end'} w={'full'}>
                        <Box flex={3}>
                            <chakra.select
                                value={draftSourceKey}
                                borderWidth={2}
                                borderColor={keyColors.primary}
                                borderRadius={0}
                                color={keyColors.primary}
                                bg={keyColors.subtle}
                                px={2}
                                h={'10'}
                                w={'full'}
                                aria-label={'ingredient-draft'}
                                onChange={(event) => {
                                    const nextSourceKey = event.target.value

                                    if (!nextSourceKey) {
                                        setDraftSourceKey('')
                                        return
                                    }

                                    append(toMethodIngredientRow(nextSourceKey, sourceByKey))
                                    setDraftSourceKey('')
                                }}
                            >
                                <option value="">Select ingredient</option>
                                {Object.entries(groupedOptions).map(([sectionName, options]) => (
                                    <optgroup key={sectionName} label={sectionName}>
                                        {options.map((option) => (
                                            <option key={option.key} value={option.key}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </chakra.select>
                        </Box>
                        {hasSavedRows ? (
                            <>
                                <Box flex={1} />
                                <Box flex={1} />
                                <Box minW={'10'} />
                            </>
                        ) : null}
                    </HStack>

                    <HStack justifyContent={'space-between'} w={'full'}>
                        <Button type={'button'} colorStyle={'secondary'} onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            type={'button'}
                            colorStyle={'primary'}
                            onClick={() => {
                                onSave(buildSavedIngredients())
                            }}
                        >
                            Save
                        </Button>
                    </HStack>
                </VStack>
            </PopupForm>
        </Box>
    )
}
