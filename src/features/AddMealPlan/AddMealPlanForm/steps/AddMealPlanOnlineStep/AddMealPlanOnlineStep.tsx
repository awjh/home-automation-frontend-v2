import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { GetExtractedExternalRecipeResponse } from '@awjh/home-automation-v2-api-models'
import { Box, HStack, Text } from '@chakra-ui/react'
import AddMealPlanFormValues from '@features/AddMealPlan/AddMealPlanForm/defs/AddMealPlanFormValues'
import AddMealPlanBaseProps from '@features/AddMealPlan/AddMealPlanForm/steps/defs/AddMealPlanBaseProps'
import { useState } from 'react'
import { Controller, UseFormSetValue } from 'react-hook-form'

export type AddMealPlanOnlineStepProps = AddMealPlanBaseProps & {
    extractTitleFromOnlineSource: (url: string) => Promise<GetExtractedExternalRecipeResponse>
    setValue: UseFormSetValue<AddMealPlanFormValues>
}

function isValidRecipeUrl(value: string) {
    try {
        const url = new URL(value)

        return (
            url.protocol === 'http:' ||
            url.protocol === 'https:' ||
            'Please enter a valid recipe URL'
        )
    } catch {
        return 'Please enter a valid recipe URL'
    }
}

export default function AddMealPlanOnlineStep({
    control,
    errors,
    extractTitleFromOnlineSource,
    onBack,
    onContinue,
    setValue,
    trigger,
}: AddMealPlanOnlineStepProps) {
    const [extractError, setExtractError] = useState<string | undefined>()
    const [isExtracting, setIsExtracting] = useState(false)

    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['recipeUrl'])

        if (isValid) {
            onContinue()
        }
    }

    const handleExtractRecipeDetails = async (recipeUrl: string) => {
        const trimmedRecipeUrl = recipeUrl.trim()
        const isValid = trigger
            ? await trigger(['recipeUrl'])
            : isValidRecipeUrl(trimmedRecipeUrl) === true

        if (!isValid) {
            return
        }

        setIsExtracting(true)
        setExtractError(undefined)

        try {
            const extractedRecipe = await extractTitleFromOnlineSource(trimmedRecipeUrl)

            setValue('title', extractedRecipe.title, {
                shouldDirty: true,
                shouldValidate: true,
            })
            setValue('prepDuration', extractedRecipe.duration.prepDuration.toString(), {
                shouldDirty: true,
                shouldValidate: true,
            })
            setValue('cookingDuration', extractedRecipe.duration.cookingDuration.toString(), {
                shouldDirty: true,
                shouldValidate: true,
            })
            setValue('standingTime', extractedRecipe.duration.standingTime.toString(), {
                shouldDirty: true,
                shouldValidate: true,
            })
        } catch {
            setExtractError('Unable to extract recipe details right now')
        } finally {
            setIsExtracting(false)
        }
    }

    return (
        <>
            <Controller
                name="recipeUrl"
                control={control}
                rules={{
                    required: 'Recipe URL is required',
                    validate: isValidRecipeUrl,
                }}
                render={({ field }) => (
                    <HStack w={'full'} align={'end'}>
                        <Box flex={1}>
                            <TextInput
                                type={'url'}
                                label={'Recipe URL'}
                                required
                                reserveErrorSpace
                                value={field.value}
                                onChange={(value) => {
                                    setExtractError(undefined)
                                    field.onChange(value)
                                }}
                                onBlur={field.onBlur}
                            />
                        </Box>
                        <Button
                            type={'button'}
                            onClick={() => {
                                void handleExtractRecipeDetails(field.value ?? '')
                            }}
                            loading={isExtracting}
                            loadingText={'Extracting'}
                        >
                            Extract details
                        </Button>
                    </HStack>
                )}
            />
            {extractError && (
                <Text mt={'-1'} color={'fg.error'} fontSize={'xs'}>
                    {extractError}
                </Text>
            )}
            {errors.recipeUrl && (
                <Text mt={'-1'} color={'fg.error'} fontSize={'xs'}>
                    {errors.recipeUrl.message}
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
                        Next
                    </Button>
                ) : (
                    <Button type={'submit'}>Next</Button>
                )}
            </HStack>
        </>
    )
}
