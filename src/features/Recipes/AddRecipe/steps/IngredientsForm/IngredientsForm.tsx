import { Fieldset, HStack, VStack } from '@chakra-ui/react'
import Button from '@atoms/Button/Button'
import useColorMode from '@hooks/useColorMode'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import IngredientsSectionForm, {
    createEmptyIngredient,
    createEmptySection,
    isIngredientRowEmpty,
    trimTrailingEmptyIngredients,
    type IngredientsFormIngredientsRow,
    type IngredientsFormValues,
} from './IngredientsSectionForm/IngredientsSectionForm'
import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'

interface IngredientsFormProps {
    initialValues?: IngredientsFormValues
    searchInternalRecipes: (keywords: string) => Promise<GetRecipesResponse>
    onNext: (values: IngredientsFormValues) => void
    onBack: () => void
}

const IngredientsForm = forwardRef<{ submit: () => Promise<boolean> }, IngredientsFormProps>(
    function IngredientsForm(props, ref) {
        const { keyColors } = useColorMode()
        const [isDragMode, setIsDragMode] = useState(false)
        const [draggingIngredient, setDraggingIngredient] = useState<{
            sectionIndex: number
            rowIndex: number
        } | null>(null)
        const [draftIngredientsBySection, setDraftIngredientsBySection] = useState<
            IngredientsFormIngredientsRow[]
        >([createEmptyIngredient()])
        const { control, clearErrors, getValues, handleSubmit, reset, setValue } =
            useForm<IngredientsFormValues>({
                defaultValues: {
                    sections: [createEmptySection(1)],
                },
                mode: 'onTouched',
            })

        useImperativeHandle(ref, () => ({
            submit: () =>
                new Promise<boolean>((resolve) => {
                    handleSubmit(
                        (input) => {
                            const hasUnsubmittedDraft = draftIngredientsBySection.some(
                                (draftIngredient) => !isIngredientRowEmpty(draftIngredient),
                            )

                            if (hasUnsubmittedDraft) {
                                window.alert(
                                    'Please clear the draft row or press Enter to add it before continuing.',
                                )
                                resolve(false)
                                return
                            }

                            props.onNext({
                                sections: input.sections.map((section) => ({
                                    ...section,
                                    ingredients: trimTrailingEmptyIngredients(section.ingredients),
                                })),
                            })
                            resolve(true)
                        },
                        () => resolve(false),
                    )()
                }),
        }))

        useEffect(() => {
            reset({
                sections: props.initialValues?.sections?.length
                    ? props.initialValues.sections
                    : [createEmptySection(1)],
            })
        }, [props.initialValues, reset])

        const {
            fields: sections,
            append: appendSection,
            remove: removeSection,
        } = useFieldArray({
            control,
            name: 'sections',
        })

        const submitHandler = (input: IngredientsFormValues) => {
            const hasUnsubmittedDraft = draftIngredientsBySection.some(
                (draftIngredient) => !isIngredientRowEmpty(draftIngredient),
            )

            if (hasUnsubmittedDraft) {
                window.alert(
                    'Please clear the draft row or press Enter to add it before continuing.',
                )
                return
            }

            props.onNext({
                sections: input.sections.map((section) => ({
                    ...section,
                    ingredients: trimTrailingEmptyIngredients(section.ingredients),
                })),
            })
        }

        const handleAddSection = () => {
            appendSection(createEmptySection(sections.length + 1))
            setDraftIngredientsBySection((currentDraftIngredients) => [
                ...currentDraftIngredients,
                createEmptyIngredient(),
            ])
        }

        const normalizeIngredientsForEditing = (
            ingredients: IngredientsFormValues['sections'][number]['ingredients'],
        ) => {
            return trimTrailingEmptyIngredients(ingredients)
        }

        const moveIngredientToSection = (targetSectionIndex: number) => {
            if (!draggingIngredient) {
                return
            }

            const { rowIndex: sourceRowIndex, sectionIndex: sourceSectionIndex } =
                draggingIngredient
            const sectionsValues = getValues('sections')
            const sourceSection = sectionsValues[sourceSectionIndex]
            const targetSection = sectionsValues[targetSectionIndex]

            if (!sourceSection || !targetSection) {
                setDraggingIngredient(null)
                return
            }

            const ingredientToMove = sourceSection.ingredients[sourceRowIndex]

            if (!ingredientToMove || isIngredientRowEmpty(ingredientToMove)) {
                setDraggingIngredient(null)
                return
            }

            const sourceIngredientsWithoutMoved = sourceSection.ingredients.filter(
                (_ingredient, ingredientIndex) => ingredientIndex !== sourceRowIndex,
            )
            const targetIngredients = trimTrailingEmptyIngredients(targetSection.ingredients)

            setValue(
                `sections.${sourceSectionIndex}.ingredients`,
                normalizeIngredientsForEditing(sourceIngredientsWithoutMoved),
                {
                    shouldDirty: true,
                },
            )
            setValue(
                `sections.${targetSectionIndex}.ingredients`,
                normalizeIngredientsForEditing([...targetIngredients, ingredientToMove]),
                {
                    shouldDirty: true,
                },
            )

            clearErrors()
            setDraggingIngredient(null)
        }

        return (
            <form noValidate onSubmit={handleSubmit(submitHandler)}>
                <Fieldset.Root size={'lg'} maxW={'full'}>
                    <VStack gap={4}>
                        <Fieldset.Legend
                            color={keyColors.primary}
                            fontSize={'2xl'}
                            fontWeight={'bold'}
                            alignSelf={'start'}
                        >
                            Add Recipe Ingredients
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <VStack gap={6} alignItems={'stretch'}>
                                {sections.map((section, sectionIndex) => (
                                    <IngredientsSectionForm
                                        key={section.id}
                                        control={control}
                                        clearErrors={clearErrors}
                                        sectionIndex={sectionIndex}
                                        sectionCount={sections.length}
                                        onDeleteSection={() => {
                                            removeSection(sectionIndex)
                                            setDraftIngredientsBySection(
                                                (currentDraftIngredients) =>
                                                    currentDraftIngredients.filter(
                                                        (_draftIngredient, draftIndex) =>
                                                            draftIndex !== sectionIndex,
                                                    ),
                                            )
                                        }}
                                        setValue={setValue}
                                        searchInternalRecipes={props.searchInternalRecipes}
                                        isDragMode={isDragMode}
                                        draggingIngredient={draggingIngredient}
                                        onDragStartIngredient={(rowIndex) => {
                                            setDraggingIngredient({
                                                sectionIndex,
                                                rowIndex,
                                            })
                                        }}
                                        onDragEndIngredient={() => {
                                            setDraggingIngredient(null)
                                        }}
                                        onDropIngredient={() => {
                                            moveIngredientToSection(sectionIndex)
                                        }}
                                        onDraftIngredientChange={(draftIngredient) => {
                                            setDraftIngredientsBySection(
                                                (currentDraftIngredients) => {
                                                    const nextDraftIngredients = [
                                                        ...currentDraftIngredients,
                                                    ]
                                                    nextDraftIngredients[sectionIndex] =
                                                        draftIngredient

                                                    return nextDraftIngredients
                                                },
                                            )
                                        }}
                                    />
                                ))}
                                <Button
                                    type={'button'}
                                    colorStyle={'secondary'}
                                    disabled={isDragMode}
                                    onClick={handleAddSection}
                                >
                                    Add Section
                                </Button>
                                {sections.length > 1 ? (
                                    <Button
                                        type={'button'}
                                        colorStyle={isDragMode ? 'primary' : 'secondary'}
                                        onClick={() => {
                                            setDraggingIngredient(null)
                                            setIsDragMode((currentValue) => !currentValue)
                                        }}
                                    >
                                        {isDragMode
                                            ? 'Exit Drag and Drop Mode'
                                            : 'Enter Drag and Drop Mode'}
                                    </Button>
                                ) : null}
                            </VStack>
                        </Fieldset.Content>
                    </VStack>
                </Fieldset.Root>
            </form>
        )
    },
)

export default IngredientsForm
