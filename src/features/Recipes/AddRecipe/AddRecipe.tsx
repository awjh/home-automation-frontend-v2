import {
    PostCalculateCaloriesBody,
    PostCalculateCaloriesResponse,
    PostRecipeResponse,
    GetRecipesResponse,
    PostRecipeBody,
    PutRecipeBody,
    PutRecipeResponse,
    GetExtractedExternalRecipeResponse,
} from '@awjh/home-automation-v2-api-models'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Recipe, RecipeTags } from '@awjh/home-automation-v2-api-models/recipes'
import { Text, VStack } from '@chakra-ui/react'
import Button from '@atoms/Button/Button'
import useColorMode from '@hooks/useColorMode'
import { useRef, useState } from 'react'
import BasicDetailsForm, {
    ProducesType,
    BasicDetailsFormValues,
} from './steps/BasicDetailsForm/BasicDetailsForm'
import CaloriesForm, { CaloriesFormValues } from './steps/CaloriesForm/CaloriesForm'
import IngredientsForm from './steps/IngredientsForm/IngredientsForm'
import { IngredientsFormValues } from './steps/IngredientsForm/IngredientsSectionForm/IngredientsSectionForm'
import MethodForm, { MethodFormValues } from './steps/MethodForm/MethodForm'
import OriginalSourceForm, {
    OriginalSourceFormValues,
} from './steps/OriginalSourceForm/OriginalSourceForm'
import TaggingForm from './steps/TaggingForm/TaggingForm'

type AddRecipeState = {
    originalSource?: OriginalSourceFormValues
    basicDetails?: BasicDetailsFormValues
    ingredients?: IngredientsFormValues
    method?: MethodFormValues
    calories?: CaloriesFormValues
    tags?: RecipeTags
}

type AddRecipeSharedProps = {
    calculateCalories({
        ingredients,
        produces,
    }: {
        ingredients: PostCalculateCaloriesBody['ingredients']
        produces: Recipe['produces']
    }): Promise<PostCalculateCaloriesResponse>
    extractRecipeFromOnlineSource(url: string): Promise<GetExtractedExternalRecipeResponse>
}

type AddRecipeCreateProps = AddRecipeSharedProps & {
    recipe?: never
    addRecipe: (recipe: PostRecipeBody) => Promise<PostRecipeResponse>
    editRecipe?: never
}

type AddRecipeEditProps = AddRecipeSharedProps & {
    recipe: Recipe
    editRecipe: (recipeId: string, recipe: PutRecipeBody) => Promise<PutRecipeResponse>
    addRecipe?: never
}

type AddRecipeProps = AddRecipeCreateProps | AddRecipeEditProps

type RecipeFormSeed = {
    originalSource?: Recipe['originalSource']
    title: string
    authors?: string[]
    image?: string
    duration?: Recipe['duration']
    produces?: Recipe['produces']
    ingredients?: Recipe['ingredients']
    method?: Recipe['method']
    tags?: RecipeTags
}

function mapOriginalSourceToFormState(
    originalSource?:
        | Recipe['originalSource']
        | GetExtractedExternalRecipeResponse['originalSource'],
): OriginalSourceFormValues | undefined {
    if (!originalSource) {
        return undefined
    }

    switch (originalSource.type) {
        case SourceType.BOOK:
            return {
                sourceType: SourceType.BOOK,
                title: originalSource.title,
                page: String(originalSource.page),
                series: originalSource.series ?? '',
                issue: '',
                url: '',
            }
        case SourceType.MAGAZINE:
            return {
                sourceType: SourceType.MAGAZINE,
                title: originalSource.title,
                page: String(originalSource.page),
                series: '',
                issue: originalSource.issue,
                url: '',
            }
        default:
            return {
                sourceType: SourceType.ONLINE,
                title: '',
                page: '',
                series: '',
                issue: '',
                url: originalSource.url,
            }
    }
}

export function mapRecipeToFormState(recipe?: Recipe): AddRecipeState {
    if (!recipe) {
        return {}
    }

    return {
        ...mapRecipeSeedToFormState(recipe),
        calories: {
            calories: String(recipe.calories ?? ''),
        },
    }
}

function mapRecipeSeedToFormState(recipe: RecipeFormSeed): Omit<AddRecipeState, 'calories'> {
    const originalSource = mapOriginalSourceToFormState(recipe.originalSource)

    const basicDetails = {
        recipeTitle: recipe.title,
        authors: recipe.authors ?? [''],
        image: recipe.image ?? '',
        cookingDuration: String(recipe.duration?.cookingDuration ?? ''),
        prepDuration: String(recipe.duration?.prepDuration ?? ''),
        standingTime: String(recipe.duration?.standingTime ?? ''),
        producesType:
            recipe.produces && 'quantity' in recipe.produces
                ? ProducesType.QUANTITY
                : ProducesType.PORTIONS,
        quantityProduced:
            recipe.produces && 'quantity' in recipe.produces
                ? String(recipe.produces.quantity)
                : '',
        measureProduced:
            recipe.produces && 'quantity' in recipe.produces ? (recipe.produces.measure ?? '') : '',
        serves:
            recipe.produces && 'serves' in recipe.produces ? String(recipe.produces.serves) : '',
    }

    const ingredients = {
        sections: (recipe.ingredients ?? []).map((section, index) => ({
            name: section.section?.trim() || `Section ${index + 1}`,
            ingredients: (section.ingredients ?? []).map((ingredient) => ({
                quantity: String(ingredient.quantity ?? ''),
                measure: ingredient.measure ?? '',
                item: ingredient.item ?? '',
                preparation: ingredient.preparation ?? '',
                linkedRecipeId: ingredient.internalRecipe?.recipeId,
            })),
        })),
    }

    const method = {
        steps: (recipe.method ?? []).map((step) => ({
            description: step.text,
            ingredients: step.ingredients ?? [],
        })),
    }

    return {
        originalSource,
        basicDetails,
        ingredients,
        method,
        tags: recipe.tags,
    }
}

function buildPostRecipeBody(formValues: AddRecipeState): PostRecipeBody {
    const { basicDetails, ingredients, method, originalSource, tags } = formValues

    const mappedIngredients =
        ingredients?.sections.map((section) => ({
            section: section.name.trim() || undefined,
            ingredients: (section.ingredients ?? []).map((ingredient) => ({
                quantity: Number(ingredient.quantity || 0),
                measure: ingredient.measure.trim() || undefined,
                item: ingredient.item || '',
                preparation: ingredient.preparation.trim() || undefined,
                internalRecipe: ingredient.linkedRecipeId
                    ? { recipeId: ingredient.linkedRecipeId }
                    : undefined,
            })),
        })) ?? []

    const mappedMethod =
        method?.steps.map((step) => ({
            text: step.description,
            ingredients: (step.ingredients ?? []).map((ingredient) => ({
                quantity: Number(ingredient.quantity || 0),
                measure: ingredient.measure || undefined,
                item: ingredient.item || '',
                preparation: ingredient.preparation || undefined,
                internalRecipe: ingredient.internalRecipe?.recipeId
                    ? { recipeId: ingredient.internalRecipe.recipeId }
                    : undefined,
            })),
        })) ?? []

    const originalSourcePayload = (() => {
        if (!originalSource) {
            return {
                type: SourceType.ONLINE,
                url: '',
            }
        }

        switch (originalSource.sourceType) {
            case SourceType.BOOK:
                return {
                    type: SourceType.BOOK,
                    title: originalSource.title,
                    page: Number(originalSource.page || 0),
                    series: originalSource.series.trim() || undefined,
                }
            case SourceType.MAGAZINE:
                return {
                    type: SourceType.MAGAZINE,
                    title: originalSource.title,
                    issue: originalSource.issue,
                    page: Number(originalSource.page || 0),
                }
            default:
                return {
                    type: SourceType.ONLINE,
                    url: originalSource.url,
                }
        }
    })()

    const duration = {
        prepDuration: Number(basicDetails?.prepDuration || 0),
        cookingDuration: Number(basicDetails?.cookingDuration || 0),
        standingTime: Number(basicDetails?.standingTime || 0),
    }

    const produces =
        basicDetails?.producesType === ProducesType.QUANTITY
            ? {
                  quantity: Number(basicDetails.quantityProduced || 0),
                  measure: basicDetails.measureProduced.trim() || undefined,
              }
            : {
                  serves: Number(basicDetails?.serves || 0),
              }

    return {
        title: basicDetails?.recipeTitle || '',
        duration,
        calories: Number(formValues.calories?.calories || 0),
        ingredients: mappedIngredients,
        originalSource: originalSourcePayload,
        tags: {
            cuisine: tags?.cuisine ?? [],
            mealType: tags?.mealType ?? [],
            meat: tags?.meat ?? [],
            dietary: tags?.dietary ?? [],
            occasion: tags?.occasion ?? [],
            equipment: tags?.equipment ?? [],
        },
        image: basicDetails?.image?.trim() || undefined,
        authors: (basicDetails?.authors ?? []).filter(Boolean),
        method: mappedMethod,
        produces,
    } as PostRecipeBody
}

type AddRecipeStepHandle = {
    submit: () => Promise<boolean>
}

export default function AddRecipe(props: AddRecipeProps) {
    const { recipe, calculateCalories, extractRecipeFromOnlineSource } = props
    const { keyColors } = useColorMode()
    const [stepIndex, setStepIndex] = useState(0)
    const [formValues, setFormValues] = useState<AddRecipeState>(() => mapRecipeToFormState(recipe))
    const activeFormRef = useRef<AddRecipeStepHandle | null>(null)
    const [blockNext, setBlockNext] = useState(false)

    const handleNext = (nextValues: Partial<AddRecipeState>) => {
        setFormValues((currentValues) => ({ ...currentValues, ...nextValues }))
    }

    const handleWizardNext = async () => {
        const isValid = await activeFormRef.current?.submit()
        if (isValid === false) {
            return
        }

        if (stepIndex < 5) {
            setStepIndex((currentStep) => Math.min(currentStep + 1, 5))
        }
    }

    const handleWizardBack = () => {
        if (stepIndex === 0) {
            return
        }

        setStepIndex((currentStep) => Math.max(currentStep - 1, 0))
    }

    const handleTaggingSubmit = async (tags: RecipeTags) => {
        const nextState = { ...formValues, tags }
        setFormValues(nextState)

        const payload = buildPostRecipeBody(nextState)

        if (props.editRecipe) {
            await props.editRecipe(props.recipe.id, payload as PutRecipeBody)
            return
        }

        await props.addRecipe(payload)
    }

    const searchInternalRecipes = async (): Promise<GetRecipesResponse> =>
        ({
            recipes: [],
        }) as unknown as GetRecipesResponse

    const renderStep = () => {
        switch (stepIndex) {
            case 0:
                return (
                    <OriginalSourceForm
                        ref={activeFormRef}
                        initialValues={formValues.originalSource}
                        onSubmitStep={(values) => handleNext({ originalSource: values })}
                        extractRecipeFromOnlineSource={async (url: string) => {
                            const result = await extractRecipeFromOnlineSource(url)

                            setFormValues((currentValues) => ({
                                ...currentValues,
                                ...mapRecipeSeedToFormState({
                                    ...result,
                                    image: result.originalImageUrl,
                                    authors:
                                        result.authors.length > 0
                                            ? result.authors
                                            : currentValues.basicDetails?.authors,
                                }),
                            }))
                        }}
                        isLookupLoading={(val: boolean) => setBlockNext(val)}
                    />
                )
            case 1:
                return (
                    <BasicDetailsForm
                        ref={activeFormRef}
                        initialValues={formValues.basicDetails}
                        onSubmitStep={(values) => handleNext({ basicDetails: values })}
                    />
                )
            case 2:
                return (
                    <IngredientsForm
                        ref={activeFormRef}
                        initialValues={formValues.ingredients}
                        searchInternalRecipes={searchInternalRecipes}
                        onSubmitStep={(values) => handleNext({ ingredients: values })}
                    />
                )
            case 3:
                return (
                    <MethodForm
                        ref={activeFormRef}
                        initialValues={formValues.method}
                        ingredientSections={formValues.ingredients?.sections ?? []}
                        onSubmitStep={(values) => handleNext({ method: values })}
                    />
                )
            case 4:
                return (
                    <CaloriesForm
                        ref={activeFormRef}
                        ingredientSections={formValues.ingredients?.sections ?? []}
                        produces={
                            formValues.basicDetails ?? {
                                producesType: ProducesType.PORTIONS,
                                quantityProduced: '',
                                measureProduced: '',
                                serves: '',
                            }
                        }
                        calculateCalories={calculateCalories}
                        initialValues={formValues.calories}
                        onSubmitStep={(values) => handleNext({ calories: values })}
                    />
                )
            default:
                return (
                    <TaggingForm
                        ref={activeFormRef}
                        initialValues={formValues.tags}
                        onSubmitStep={handleTaggingSubmit}
                    />
                )
        }
    }

    return (
        <VStack alignItems={'stretch'} gap={4} px={6} w={'full'}>
            <Text color={keyColors.primary} fontSize={'xl'} fontWeight={'bold'}>
                {recipe ? 'Edit' : 'Add'} Recipe ({stepIndex + 1} of 6)
            </Text>
            {renderStep()}
            <VStack alignItems={'stretch'} gap={3}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <Button
                        type={'button'}
                        colorStyle={'secondary'}
                        disabled={stepIndex === 0 || blockNext}
                        onClick={handleWizardBack}
                    >
                        Back
                    </Button>
                    <Button
                        type={'button'}
                        colorStyle={'primary'}
                        onClick={handleWizardNext}
                        disabled={blockNext}
                    >
                        {stepIndex === 5 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </VStack>
        </VStack>
    )
}
