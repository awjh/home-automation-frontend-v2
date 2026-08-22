'use client'

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
import {
    isSupportedImageContentType,
    UploadRecipeImageInput,
    UploadRecipeImageResponse,
} from '@defs/Image'
import useColorMode from '@hooks/useColorMode'
import fileToBase64 from '@utils/fileToBase64'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import BasicDetailsForm, {
    ProducesType,
    BasicDetailsFormValues,
} from './steps/BasicDetailsForm/BasicDetailsForm'
import CaloriesForm, { CaloriesFormValues } from './steps/CaloriesForm/CaloriesForm'
import ImageForm, {
    HasImageOption,
    ImageFormValues,
    ImageSourceOption,
} from './steps/ImageForm/ImageForm'
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
    image?: ImageFormValues
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
    uploadRecipeImage: (input: UploadRecipeImageInput) => Promise<UploadRecipeImageResponse>
}

type AddRecipeEditProps = AddRecipeSharedProps & {
    recipe: Recipe
    editRecipe: (recipeId: string, recipe: PutRecipeBody) => Promise<PutRecipeResponse>
    addRecipe?: never
    uploadRecipeImage?: never
}

type AddRecipeProps = AddRecipeCreateProps | AddRecipeEditProps

type RecipeFormSeed = {
    originalSource?: Recipe['originalSource']
    title: string
    authors?: string[]
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

function buildPostRecipeBody(formValues: AddRecipeState, imageKey?: string): PostRecipeBody {
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
        image: imageKey,
        authors: (basicDetails?.authors ?? []).filter(Boolean),
        method: mappedMethod,
        produces,
    } as PostRecipeBody
}

type AddRecipeStepHandle = {
    submit: () => Promise<boolean>
}

async function resolveImageKey(
    imageValues: ImageFormValues | undefined,
    uploadRecipeImage: (input: UploadRecipeImageInput) => Promise<UploadRecipeImageResponse>,
): Promise<string | undefined> {
    if (!imageValues || imageValues.hasImage !== HasImageOption.YES) {
        return undefined
    }

    if (imageValues.imageSource === ImageSourceOption.UPLOAD) {
        if (!imageValues.imageFile) {
            return undefined
        }

        if (!isSupportedImageContentType(imageValues.imageFile.type)) {
            throw new Error(`Unsupported image content type: ${imageValues.imageFile.type}`)
        }

        const data = await fileToBase64(imageValues.imageFile)

        const { key } = await uploadRecipeImage({
            source: 'file',
            contentType: imageValues.imageFile.type,
            data,
        })

        return key
    }

    if (!imageValues.imageUrl) {
        return undefined
    }

    const { key } = await uploadRecipeImage({ source: 'url', url: imageValues.imageUrl })

    return key
}

type AddRecipeStepKey =
    | 'originalSource'
    | 'basicDetails'
    | 'image'
    | 'ingredients'
    | 'method'
    | 'calories'
    | 'tagging'

export default function AddRecipe(props: AddRecipeProps) {
    const { recipe, calculateCalories, extractRecipeFromOnlineSource } = props
    const { keyColors } = useColorMode()
    const router = useRouter()
    const [stepIndex, setStepIndex] = useState(0)
    const [formValues, setFormValues] = useState<AddRecipeState>(() => mapRecipeToFormState(recipe))
    const activeFormRef = useRef<AddRecipeStepHandle | null>(null)
    const [blockNext, setBlockNext] = useState(false)

    const steps = useMemo<AddRecipeStepKey[]>(() => {
        const stepKeys: AddRecipeStepKey[] = ['originalSource', 'basicDetails']

        if (!recipe) {
            stepKeys.push('image')
        }

        stepKeys.push('ingredients', 'method', 'calories', 'tagging')

        return stepKeys
    }, [recipe])

    const lastStepIndex = steps.length - 1

    const handleNext = (nextValues: Partial<AddRecipeState>) => {
        setFormValues((currentValues) => ({ ...currentValues, ...nextValues }))
    }

    const handleWizardNext = async () => {
        const isValid = await activeFormRef.current?.submit()
        if (isValid === false) {
            return
        }

        if (stepIndex < lastStepIndex) {
            setStepIndex((currentStep) => Math.min(currentStep + 1, lastStepIndex))
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

        if (props.editRecipe) {
            const payload = buildPostRecipeBody(nextState, props.recipe.image)
            await props.editRecipe(props.recipe.id, payload as PutRecipeBody)
            router.push(`/recipes/${props.recipe.id}`)
            return
        }

        const imageKey = await resolveImageKey(nextState.image, props.uploadRecipeImage)
        const payload = buildPostRecipeBody(nextState, imageKey)

        const result = await props.addRecipe(payload)
        router.push(`/recipes/${result.id}`)
    }

    const searchInternalRecipes = async (): Promise<GetRecipesResponse> =>
        ({
            recipes: [],
        }) as unknown as GetRecipesResponse

    const renderStep = () => {
        switch (steps[stepIndex]) {
            case 'originalSource':
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
                                    authors:
                                        result.authors.length > 0
                                            ? result.authors
                                            : currentValues.basicDetails?.authors,
                                }),
                                image: result.originalImageUrl
                                    ? {
                                          hasImage: HasImageOption.YES,
                                          imageSource: ImageSourceOption.URL,
                                          imageUrl: result.originalImageUrl,
                                          imageFile: null,
                                      }
                                    : currentValues.image,
                            }))
                        }}
                        isLookupLoading={(val: boolean) => setBlockNext(val)}
                    />
                )
            case 'basicDetails':
                return (
                    <BasicDetailsForm
                        ref={activeFormRef}
                        initialValues={formValues.basicDetails}
                        onSubmitStep={(values) => handleNext({ basicDetails: values })}
                    />
                )
            case 'image':
                return (
                    <ImageForm
                        ref={activeFormRef}
                        initialValues={formValues.image}
                        onSubmitStep={(values) => handleNext({ image: values })}
                    />
                )
            case 'ingredients':
                return (
                    <IngredientsForm
                        ref={activeFormRef}
                        initialValues={formValues.ingredients}
                        searchInternalRecipes={searchInternalRecipes}
                        onSubmitStep={(values) => handleNext({ ingredients: values })}
                    />
                )
            case 'method':
                return (
                    <MethodForm
                        ref={activeFormRef}
                        initialValues={formValues.method}
                        ingredientSections={formValues.ingredients?.sections ?? []}
                        onSubmitStep={(values) => handleNext({ method: values })}
                    />
                )
            case 'calories':
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
                {recipe ? 'Edit' : 'Add'} Recipe ({stepIndex + 1} of {steps.length})
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
                        {stepIndex === lastStepIndex ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </VStack>
        </VStack>
    )
}
