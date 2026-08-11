import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { PostCalculateCaloriesResponse } from '@awjh/home-automation-v2-api-models'
import { Ingredient, Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { Fieldset, HStack, Text, VStack } from '@chakra-ui/react'
import MethodIngredients from '@features/Recipes/ViewRecipe/MethodIngredients/MethodIngredients'
import useColorMode from '@hooks/useColorMode'
import useToaster from '@hooks/useToaster'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BasicDetailsFormValues, ProducesType } from '../BasicDetailsForm/BasicDetailsForm'
import { IngredientsFormSection } from '../IngredientsForm/IngredientsSectionForm/IngredientsSectionForm'

export type CaloriesFormValues = {
    calories: string
}

interface CaloriesFormProps {
    ingredientSections: IngredientsFormSection[]
    produces: Pick<
        BasicDetailsFormValues,
        'producesType' | 'quantityProduced' | 'measureProduced' | 'serves'
    >
    calculateCalories: ({
        ingredients,
        produces,
    }: {
        ingredients: Ingredient[]
        produces: Recipe['produces']
    }) => Promise<PostCalculateCaloriesResponse>
    onNext: (calories: CaloriesFormValues) => void
    onBack: () => void
}

export default function CaloriesForm(props: CaloriesFormProps) {
    const { keyColors } = useColorMode()
    const toaster = useToaster()

    const [lookupLoading, setLookupLoading] = useState(false)
    const [unresolvedIngredients, setUnresolvedIngredients] = useState<
        PostCalculateCaloriesResponse['unresolvedIngredients']
    >([])

    const ingredients = useMemo(
        () =>
            props.ingredientSections.flatMap((section) =>
                section.ingredients.map(
                    (ingredient) =>
                        ({
                            quantity: Number.parseInt(ingredient.quantity, 10),
                            measure: ingredient.measure,
                            item: ingredient.item,
                            internalRecipe: ingredient.linkedRecipeId
                                ? {
                                      recipeId: ingredient.linkedRecipeId,
                                  }
                                : undefined,
                        }) satisfies Ingredient,
                ),
            ),
        [props.ingredientSections],
    )

    const { control, handleSubmit, setValue } = useForm<CaloriesFormValues>({
        defaultValues: {
            calories: '0',
        },
        mode: 'onTouched',
    })

    const submitHandler = (data: CaloriesFormValues) => {
        props.onNext(data)
    }

    return (
        <form onSubmit={handleSubmit(submitHandler)} noValidate>
            <Fieldset.Root size={'lg'} maxW={'md'}>
                <VStack gap={4}>
                    <Fieldset.Legend
                        color={keyColors.primary}
                        fontSize={'2xl'}
                        fontWeight={'bold'}
                        alignSelf={'start'}
                    >
                        Calories
                    </Fieldset.Legend>
                    <Fieldset.Content>
                        <VStack gap={4} alignItems={'stretch'}>
                            <HStack alignItems={'end'}>
                                <Controller
                                    name={'calories'}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextInput
                                            label={`Calories`}
                                            type={'number'}
                                            required={true}
                                            errorMessage={fieldState?.error?.message}
                                            {...field}
                                        />
                                    )}
                                />
                                <Button
                                    type={'button'}
                                    colorStyle={'secondary'}
                                    loading={lookupLoading}
                                    disabled={lookupLoading}
                                    onClick={async () => {
                                        setLookupLoading(true)
                                        setUnresolvedIngredients([])

                                        let result: PostCalculateCaloriesResponse

                                        try {
                                            result = await props.calculateCalories({
                                                ingredients,
                                                produces:
                                                    props.produces.producesType ===
                                                    ProducesType.QUANTITY
                                                        ? ({
                                                              quantity: Number.parseInt(
                                                                  props.produces.quantityProduced,
                                                                  10,
                                                              ),
                                                              measure:
                                                                  props.produces.measureProduced,
                                                          } satisfies Recipe['produces'])
                                                        : ({
                                                              serves: Number.parseInt(
                                                                  props.produces.serves,
                                                                  10,
                                                              ),
                                                          } satisfies Recipe['produces']),
                                            })
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        } catch (_error) {
                                            toaster.create({
                                                title: 'Failed to lookup calories',
                                                description:
                                                    'There was an error while looking up the calories. Please try again.',
                                                type: 'error',
                                            })
                                            setLookupLoading(false)
                                            return
                                        }

                                        if (result.unresolvedIngredients.length > 0) {
                                            toaster.create({
                                                title: 'Some ingredients could not be resolved',
                                                description:
                                                    'Some ingredients could not be resolved. Please check the list below.',
                                                type: 'info',
                                            })
                                        }

                                        setUnresolvedIngredients(result.unresolvedIngredients)
                                        setValue('calories', result.calories.toString())
                                        setLookupLoading(false)
                                    }}
                                >
                                    Lookup calories
                                </Button>
                            </HStack>
                            {unresolvedIngredients.length > 0 && (
                                <VStack alignItems={'stretch'} gap={2}>
                                    <Text color={keyColors.primary}>
                                        The following ingredients could not be resolved:
                                    </Text>
                                    <MethodIngredients
                                        ingredients={ingredients.filter((_, idx) =>
                                            unresolvedIngredients.includes(idx),
                                        )}
                                    />
                                </VStack>
                            )}
                            <HStack justifyContent={'space-between'}>
                                <Button
                                    type={'button'}
                                    colorStyle={'secondary'}
                                    onClick={props.onBack}
                                >
                                    Back
                                </Button>
                                <Button type={'submit'} colorStyle={'primary'}>
                                    Next
                                </Button>
                            </HStack>
                        </VStack>
                    </Fieldset.Content>
                </VStack>
            </Fieldset.Root>
        </form>
    )
}
