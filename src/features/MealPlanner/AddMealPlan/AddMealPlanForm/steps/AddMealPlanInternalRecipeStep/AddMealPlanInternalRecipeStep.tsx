import Button from '@atoms/Button/Button'
import { HStack } from '@chakra-ui/react'
import InternalRecipeSearchForm, {
    InternalRecipeSummary,
} from '@molecules/InternalRecipeSearchForm/InternalRecipeSearchForm'
import AddMealPlanBaseProps from '@features/MealPlanner/AddMealPlan/AddMealPlanForm/steps/defs/AddMealPlanBaseProps'
import { Controller } from 'react-hook-form'
import { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'

export type InternalRecipeSearchParams = {
    keywords: string
}

export type AddMealPlanInternalRecipeStepProps = AddMealPlanBaseProps & {
    searchRecipes: (keywords: string) => Promise<GetRecipesResponse>
    onRecipeSelected?: (recipe: InternalRecipeSummary) => void
}

export default function AddMealPlanInternalRecipeStep({
    control,
    errors,
    onBack,
    searchRecipes,
    onRecipeSelected,
    onContinue,
    trigger,
}: AddMealPlanInternalRecipeStepProps) {
    const handleContinue = async () => {
        if (!trigger || !onContinue) {
            return
        }

        const isValid = await trigger(['internalRecipeId'])

        if (isValid) {
            onContinue()
        }
    }

    return (
        <Controller
            name="internalRecipeId"
            control={control}
            rules={{ required: 'Please select a recipe' }}
            render={({ field }) => {
                return (
                    <>
                        <InternalRecipeSearchForm
                            searchRecipes={searchRecipes}
                            selectedRecipeId={field.value}
                            selectionErrorMessage={errors.internalRecipeId?.message?.toString()}
                            onSelectRecipe={(recipe) => {
                                field.onChange(recipe.id)
                                onRecipeSelected?.(recipe)
                            }}
                        />
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
