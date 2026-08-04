import Button from '@atoms/Button/Button'
import { Box, Fieldset, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { Ingredient } from '@awjh/home-automation-v2-api-models/recipes'
import useColorMode from '@hooks/useColorMode'
import { useState, type KeyboardEvent } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { LuPencil, LuTrash } from 'react-icons/lu'
import MethodField from './MethodField/MethodField'
import MethodIngredients from '../../ViewRecipe/MethodIngredients/MethodIngredients'
import MethodIngredientsPopup from './MethodIngredientsPopup/MethodIngredientsPopup'
import { type IngredientsFormSection } from '../IngredientsForm/IngredientsSectionForm/IngredientsSectionForm'

export type MethodFormStep = {
    description: string
    ingredients: Ingredient[]
}

export type MethodFormValues = {
    steps: MethodFormStep[]
}

export type MethodFieldPath = `steps.${number}.description`

const METHOD_INDEX_WIDTH = '8'
const DELETE_BUTTON_WIDTH = '10'

const EMPTY_METHOD_STEP: MethodFormStep = {
    description: '',
    ingredients: [],
}

export function createEmptyMethodStep(): MethodFormStep {
    return { ...EMPTY_METHOD_STEP }
}

export function isMethodStepEmpty(step?: MethodFormStep) {
    if (!step) {
        return true
    }

    return step.description.trim() === ''
}

export function trimTrailingEmptyMethodSteps(steps: MethodFormStep[]) {
    const trimmedSteps = [...steps]

    while (trimmedSteps.length > 0 && isMethodStepEmpty(trimmedSteps[trimmedSteps.length - 1])) {
        trimmedSteps.pop()
    }

    return trimmedSteps
}

interface MethodFormProps {
    ingredientSections?: IngredientsFormSection[]
    onNext: (values: MethodFormValues) => void
    onBack: () => void
}

export default function MethodForm(props: MethodFormProps) {
    const { keyColors } = useColorMode()
    const { ingredientSections = [] } = props
    const [draftStep, setDraftStep] = useState(createEmptyMethodStep())
    const [draftError, setDraftError] = useState<string | undefined>()
    const [editingIngredientsStepIndex, setEditingIngredientsStepIndex] = useState<number | null>(
        null,
    )
    const { control, getValues, handleSubmit, setValue } = useForm<MethodFormValues>({
        defaultValues: {
            steps: [],
        },
        mode: 'onTouched',
    })

    const { append, fields, remove } = useFieldArray({
        control,
        name: 'steps',
    })
    const watchedSteps = useWatch({ control, name: 'steps' }) as MethodFormStep[] | undefined

    const submitHandler = (input: MethodFormValues) => {
        if (!isMethodStepEmpty(draftStep)) {
            window.alert('Please clear the draft step or press Enter to add it before continuing.')
            return
        }

        props.onNext({
            steps: trimTrailingEmptyMethodSteps(input.steps),
        })
    }

    const handleDraftRowEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        event.preventDefault()

        if (isMethodStepEmpty(draftStep)) {
            setDraftError(undefined)
            return
        }

        append(draftStep)
        setDraftStep(createEmptyMethodStep())
        setDraftError(undefined)
    }

    return (
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
            <Fieldset.Root size={'lg'} maxW={'full'}>
                <VStack gap={4} alignItems={'stretch'}>
                    <Fieldset.Legend
                        color={keyColors.primary}
                        fontSize={'2xl'}
                        fontWeight={'bold'}
                        alignSelf={'start'}
                    >
                        Add Recipe Method
                    </Fieldset.Legend>
                    <Fieldset.Content>
                        <VStack gap={4} alignItems={'stretch'}>
                            {fields.map((field, rowIndex) => (
                                <HStack key={field.id} alignItems={'stretch'} gap={3} w={'full'}>
                                    <Text
                                        color={keyColors.primary}
                                        minW={METHOD_INDEX_WIDTH}
                                        pt={2}
                                    >
                                        {rowIndex + 1}.
                                    </Text>
                                    <Box flex={1}>
                                        <VStack gap={2} alignItems={'stretch'}>
                                            <MethodField
                                                control={control}
                                                fieldPath={
                                                    `steps.${rowIndex}.description` as MethodFieldPath
                                                }
                                                fieldName={'description'}
                                                required={true}
                                                isDraftRow={false}
                                                colSpan={1}
                                                onDraftRowEnter={() => {}}
                                            />
                                            <HStack alignItems={'start'} gap={2} w={'full'}>
                                                <Box flex={1} fontSize={'sm'}>
                                                    <MethodIngredients
                                                        ingredients={
                                                            watchedSteps?.[rowIndex]?.ingredients ??
                                                            field.ingredients
                                                        }
                                                        showWhenEmpty={true}
                                                        maxW={'full'}
                                                        small={true}
                                                    />
                                                </Box>
                                                <IconButton
                                                    type={'button'}
                                                    aria-label={'edit method ingredients'}
                                                    color={keyColors.primary}
                                                    _hover={{
                                                        bg: keyColors.buttonHoverBg,
                                                        color: keyColors.secondary,
                                                    }}
                                                    background={keyColors.subtle}
                                                    borderWidth={1}
                                                    borderColor={keyColors.primary}
                                                    borderRadius={0}
                                                    flexShrink={0}
                                                    size={'sm'}
                                                    px={'20px'}
                                                    py={'26px'}
                                                    onClick={() => {
                                                        setEditingIngredientsStepIndex(rowIndex)
                                                    }}
                                                >
                                                    <LuPencil />
                                                </IconButton>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                    <IconButton
                                        type={'button'}
                                        aria-label={'delete method step'}
                                        color={keyColors.primary}
                                        _hover={{
                                            bg: keyColors.buttonHoverBg,
                                            color: keyColors.secondary,
                                        }}
                                        background={keyColors.secondary}
                                        borderWidth={2}
                                        borderColor={keyColors.primary}
                                        borderRadius={0}
                                        alignSelf={'stretch'}
                                        h={'auto'}
                                        w={DELETE_BUTTON_WIDTH}
                                        minW={DELETE_BUTTON_WIDTH}
                                        onClick={() => {
                                            remove(rowIndex)
                                        }}
                                    >
                                        <LuTrash />
                                    </IconButton>
                                </HStack>
                            ))}
                            <HStack alignItems={'stretch'} gap={3} w={'full'}>
                                <Box minW={METHOD_INDEX_WIDTH} />
                                <Box flex={1}>
                                    <MethodField
                                        fieldName={'description'}
                                        required={false}
                                        isDraftRow={true}
                                        value={draftStep.description}
                                        errorMessage={draftError}
                                        colSpan={1}
                                        onDraftRowEnter={handleDraftRowEnter}
                                        onValueChange={(value) => {
                                            setDraftStep((currentDraftStep) => ({
                                                ...currentDraftStep,
                                                description: value,
                                            }))

                                            if (draftError && value.trim()) {
                                                setDraftError(undefined)
                                            }
                                        }}
                                    />
                                </Box>
                                <Box w={DELETE_BUTTON_WIDTH} minW={DELETE_BUTTON_WIDTH} />
                            </HStack>
                        </VStack>
                    </Fieldset.Content>
                    {editingIngredientsStepIndex !== null ? (
                        <MethodIngredientsPopup
                            stepIndex={editingIngredientsStepIndex}
                            ingredientSections={ingredientSections}
                            initialIngredients={
                                getValues(`steps.${editingIngredientsStepIndex}.ingredients`) ?? []
                            }
                            onCancel={() => {
                                setEditingIngredientsStepIndex(null)
                            }}
                            onSave={(ingredients) => {
                                setValue(
                                    `steps.${editingIngredientsStepIndex}.ingredients`,
                                    ingredients,
                                    {
                                        shouldDirty: true,
                                    },
                                )
                                setEditingIngredientsStepIndex(null)
                            }}
                        />
                    ) : null}
                    <HStack justifyContent={'space-between'}>
                        <Button type={'button'} colorStyle={'secondary'} onClick={props.onBack}>
                            Back
                        </Button>
                        <Button type={'submit'} colorStyle={'primary'}>
                            Next
                        </Button>
                    </HStack>
                </VStack>
            </Fieldset.Root>
        </form>
    )
}
