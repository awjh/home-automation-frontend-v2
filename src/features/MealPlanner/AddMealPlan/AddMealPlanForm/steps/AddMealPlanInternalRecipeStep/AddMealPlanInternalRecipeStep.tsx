import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { Flex, HStack, Text, VStack } from '@chakra-ui/react'
import AddMealPlanFormValues from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import AddMealPlanBaseProps from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/steps/defs/AddMealPlanBaseProps'
import useColorMode from '@hooks/useColorMode'
import { useState } from 'react'
import { Controller, UseFormSetValue } from 'react-hook-form'
import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'
import formatAuthors from '@utils/formatAuthors'

export type InternalRecipeSearchParams = {
    keywords: string
}

export type AddMealPlanInternalRecipeStepProps = AddMealPlanBaseProps & {
    searchRecipes: (keywords: string) => Promise<GetRecipesResponse>
    setValue: UseFormSetValue<AddMealPlanFormValues>
}

export default function AddMealPlanInternalRecipeStep({
    control,
    errors,
    onBack,
    searchRecipes,
    setValue,
    onContinue,
    trigger,
}: AddMealPlanInternalRecipeStepProps) {
    const { keyColors } = useColorMode()
    const [keywordsQuery, setKeywordsQuery] = useState('')
    const [results, setResults] = useState<GetRecipesResponse>([])
    const [searchError, setSearchError] = useState<string | undefined>()
    const [searchPerformed, setSearchPerformed] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['internalRecipeId'])

        if (isValid) {
            onContinue()
        }
    }

    const handleSearch = async () => {
        if (!keywordsQuery.trim()) {
            setSearchPerformed(false)
            setResults([])
            setSearchError('Enter keywords to search')
            return
        }

        setIsSearching(true)
        setSearchError(undefined)

        try {
            const foundRecipes = await searchRecipes(keywordsQuery.trim())

            setResults(foundRecipes)
            setSearchPerformed(true)
        } catch {
            setResults([])
            setSearchPerformed(true)
            setSearchError('Unable to search recipes right now')
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <Controller
            name="internalRecipeId"
            control={control}
            rules={{ required: 'Please select a recipe' }}
            render={({ field }) => {
                const selectedRecipe = results.find((recipe) => recipe.id === field.value)

                return (
                    <>
                        <TextInput
                            type={'text'}
                            label={'Search recipes'}
                            required={false}
                            value={keywordsQuery}
                            onChange={(event) => setKeywordsQuery(event.target.value)}
                        />
                        <Button
                            type={'button'}
                            onClick={() => {
                                void handleSearch()
                            }}
                            loading={isSearching}
                            loadingText={'Searching'}
                        >
                            Search
                        </Button>
                        {searchError && (
                            <Text color={'fg.error'} fontSize={'sm'}>
                                {searchError}
                            </Text>
                        )}
                        {searchPerformed && !searchError && results.length === 0 && (
                            <Text color={'fg.error'} fontSize={'sm'}>
                                No recipes found
                            </Text>
                        )}
                        {results.length > 0 && (
                            <VStack w={'full'} alignItems={'stretch'} gap={2}>
                                {results.map((recipe) => {
                                    const isSelected = field.value === recipe.id

                                    return (
                                        <Flex
                                            key={recipe.id}
                                            borderWidth={2}
                                            borderColor={
                                                isSelected
                                                    ? keyColors.primary
                                                    : keyColors.buttonHoverBg
                                            }
                                            bg={isSelected ? keyColors.subtle : 'transparent'}
                                            p={3}
                                            justifyContent={'space-between'}
                                            alignItems={'center'}
                                            gap={3}
                                        >
                                            <VStack alignItems={'start'} gap={0} flex={1}>
                                                <Text color={keyColors.primary}>
                                                    {recipe.title}
                                                </Text>
                                                <Text color={keyColors.primary} fontSize={'sm'}>
                                                    {recipe.authors.join(', ')}
                                                </Text>
                                            </VStack>
                                            <Button
                                                type={'button'}
                                                onClick={() => {
                                                    setValue('internalRecipeId', recipe.id, {
                                                        shouldDirty: true,
                                                        shouldValidate: true,
                                                    })
                                                    setValue('title', recipe.title, {
                                                        shouldDirty: true,
                                                    })
                                                    setValue(
                                                        'author',
                                                        formatAuthors(recipe.authors),
                                                        {
                                                            shouldDirty: true,
                                                        },
                                                    )
                                                    setValue(
                                                        'prepDuration',
                                                        recipe.duration.prepDuration.toString(),
                                                        { shouldDirty: true },
                                                    )
                                                    setValue(
                                                        'cookingDuration',
                                                        recipe.duration.cookingDuration.toString(),
                                                        { shouldDirty: true },
                                                    )
                                                    setValue(
                                                        'standingTime',
                                                        recipe.duration.standingTime.toString(),
                                                        { shouldDirty: true },
                                                    )
                                                }}
                                                colorStyle={isSelected ? 'secondary' : 'primary'}
                                                size={'sm'}
                                            >
                                                {isSelected ? 'Selected' : 'Select'}
                                            </Button>
                                        </Flex>
                                    )
                                })}
                            </VStack>
                        )}
                        {selectedRecipe && (
                            <Text color={keyColors.primary} fontSize={'sm'}>
                                Selected recipe: {selectedRecipe.title} by{' '}
                                {selectedRecipe.authors.join(', ')}
                            </Text>
                        )}
                        {errors.internalRecipeId?.message && (
                            <Text color={'fg.error'} fontSize={'sm'}>
                                {errors.internalRecipeId.message}
                            </Text>
                        )}
                        <HStack mt={2} w={'full'} justifyContent={'space-between'}>
                            <Button type={'button'} onClick={onBack} colorStyle={'secondary'}>
                                Back
                            </Button>
                            {onContinue ? (
                                <Button
                                    type={'button'}
                                    onClick={() => {
                                        void handleContinue()
                                    }}
                                >
                                    Submit
                                </Button>
                            ) : (
                                <Button type={'submit'}>Submit</Button>
                            )}
                        </HStack>
                    </>
                )
            }}
        />
    )
}
