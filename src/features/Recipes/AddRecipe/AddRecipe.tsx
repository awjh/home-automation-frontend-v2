import {
    PostCalculateCaloriesBody,
    PostCalculateCaloriesResponse,
    PostRecipeResponse,
    GetRecipesResponse,
    PostRecipeBody,
    GetExtractedExternalRecipeBasicsResponse,
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

type AddRecipeFormState = {
    originalSource?: OriginalSourceFormValues
    basicDetails?: BasicDetailsFormValues
    ingredients?: IngredientsFormValues
    method?: MethodFormValues
    calories?: CaloriesFormValues
    tags?: RecipeTags
}

type AddRecipeFormProps = {
    recipe?: Recipe
    addRecipe: (recipe: PostRecipeBody) => Promise<PostRecipeResponse>
    calculateCalories({
        ingredients,
        produces,
    }: {
        ingredients: PostCalculateCaloriesBody['ingredients']
        produces: Recipe['produces']
    }): Promise<PostCalculateCaloriesResponse>
    extractRecipeFromOnlineSource(url: string): Promise<GetExtractedExternalRecipeBasicsResponse>
}

export function mapRecipeToFormState(recipe?: Recipe): AddRecipeFormState {
    if (!recipe) {
        return {}
    }

    const originalSource = (() => {
        if (!recipe.originalSource) {
            return undefined
        }

        switch (recipe.originalSource.type) {
            case SourceType.BOOK:
                return {
                    sourceType: SourceType.BOOK,
                    title: recipe.originalSource.title,
                    page: String(recipe.originalSource.page),
                    series: recipe.originalSource.series ?? '',
                    issue: '',
                    url: '',
                }
            case SourceType.MAGAZINE:
                return {
                    sourceType: SourceType.MAGAZINE,
                    title: recipe.originalSource.title,
                    page: String(recipe.originalSource.page),
                    series: '',
                    issue: recipe.originalSource.issue,
                    url: '',
                }
            default:
                return {
                    sourceType: SourceType.ONLINE,
                    title: '',
                    page: '',
                    series: '',
                    issue: '',
                    url: recipe.originalSource.url,
                }
        }
    })()

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
        calories: {
            calories: String(recipe.calories ?? ''),
        },
        tags: recipe.tags,
    }
}

function buildPostRecipeBody(formValues: AddRecipeFormState): PostRecipeBody {
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

export default function AddRecipeForm({
    recipe,
    calculateCalories,
    addRecipe,
    extractRecipeFromOnlineSource,
}: AddRecipeFormProps) {
    const { keyColors } = useColorMode()
    const [stepIndex, setStepIndex] = useState(0)
    const [formValues, setFormValues] = useState<AddRecipeFormState>(() =>
        mapRecipeToFormState(recipe),
    )
    const activeFormRef = useRef<AddRecipeStepHandle | null>(null)

    const handleNext = (nextValues: Partial<AddRecipeFormState>) => {
        setFormValues((currentValues) => ({ ...currentValues, ...nextValues }))
    }

    const handleBack = () => {
        setStepIndex((currentStep) => Math.max(currentStep - 1, 0))
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
                        onNext={(values) => handleNext({ originalSource: values })}
                        onBack={handleBack}
                        extractRecipeFromOnlineSource={async (url: string) => {
                            const result = await extractRecipeFromOnlineSource(url)

                            // TODO update the form states with the extracted recipe data
                            // add stories to original source form for button click and toasts
                            // and then also this form for the checking it sets up ingredients etc
                        }}
                    />
                )
            case 1:
                return (
                    <BasicDetailsForm
                        ref={activeFormRef}
                        initialValues={formValues.basicDetails}
                        onNext={(values) => handleNext({ basicDetails: values })}
                        onBack={handleBack}
                    />
                )
            case 2:
                return (
                    <IngredientsForm
                        ref={activeFormRef}
                        initialValues={formValues.ingredients}
                        searchInternalRecipes={searchInternalRecipes}
                        onNext={(values) => handleNext({ ingredients: values })}
                        onBack={handleBack}
                    />
                )
            case 3:
                return (
                    <MethodForm
                        ref={activeFormRef}
                        initialValues={formValues.method}
                        ingredientSections={formValues.ingredients?.sections ?? []}
                        onNext={(values) => handleNext({ method: values })}
                        onBack={handleBack}
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
                        onNext={(values) => handleNext({ calories: values })}
                        onBack={handleBack}
                    />
                )
            default:
                return (
                    <TaggingForm
                        ref={activeFormRef}
                        initialValues={formValues.tags}
                        onNext={async (values) => {
                            const nextState = { ...formValues, tags: values }
                            setFormValues(nextState)
                            await addRecipe(buildPostRecipeBody(nextState))
                        }}
                        onBack={handleBack}
                    />
                )
        }
    }

    return (
        <VStack alignItems={'stretch'} gap={4}>
            <Text color={keyColors.primary} fontSize={'xl'} fontWeight={'bold'}>
                {recipe ? 'Edit' : 'Add'} Recipe ({stepIndex + 1} of 6)
            </Text>
            {renderStep()}
            <VStack alignItems={'stretch'} gap={3}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <Button
                        type={'button'}
                        colorStyle={'secondary'}
                        disabled={stepIndex === 0}
                        onClick={handleWizardBack}
                    >
                        Back
                    </Button>
                    <Button type={'button'} colorStyle={'primary'} onClick={handleWizardNext}>
                        {stepIndex === 5 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </VStack>
        </VStack>
    )
}
