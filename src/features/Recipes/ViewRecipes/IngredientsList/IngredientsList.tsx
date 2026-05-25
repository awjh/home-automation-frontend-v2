import DottedValuePair from '@atoms/DottedValuePair/DottedValuePair'
import { Ingredient } from '@awjh/home-automation-v2-api-models/recipes'
import { Flex } from '@chakra-ui/react'
import joinValues from '@utils/joinValues'

export interface IngredientsListProps {
    ingredients: Ingredient[]
}

export default function IngredientsList({ ingredients }: IngredientsListProps) {
    return (
        <Flex w={'full'} flexDirection={'column'} gap={2}>
            {ingredients.map((ingredient, idx) => (
                <DottedValuePair
                    key={`ingredient-${idx}`}
                    left={joinValues(ingredient.item, ingredient.preparation, ',')}
                    right={joinValues(ingredient.quantity, ingredient.measure)}
                />
            ))}
        </Flex>
    )
}
