import DottedValuePair from '@atoms/DottedValuePair/DottedValuePair'
import { Ingredient } from '@awjh/home-automation-v2-api-models/recipes'
import { Flex } from '@chakra-ui/react'
import joinValues from '@utils/joinValues'

export interface IngredientsListProps {
    ingredients: Ingredient[]
    small?: boolean
}

function uppercaseFirstCharacter(value: string | number) {
    const text = `${value}`

    return text.length ? `${text[0].toUpperCase()}${text.slice(1)}` : text
}

export default function IngredientsList({ ingredients, small }: IngredientsListProps) {
    return (
        <Flex w={'full'} flexDirection={'column'} gap={2}>
            {ingredients.map((ingredient, idx) => (
                <DottedValuePair
                    small={small}
                    key={`ingredient-${idx}`}
                    left={uppercaseFirstCharacter(
                        joinValues(ingredient.item, ingredient.preparation, ','),
                    )}
                    right={joinValues(ingredient.quantity, ingredient.measure)}
                />
            ))}
        </Flex>
    )
}
