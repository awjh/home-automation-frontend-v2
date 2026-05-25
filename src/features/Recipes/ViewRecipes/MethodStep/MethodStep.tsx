import { Ingredient } from '@awjh/home-automation-v2-api-models/recipes'
import { Text, VStack } from '@chakra-ui/react'
import MethodIngredients from '../MethodIngredients/MethodIngredients'
import useColorMode from '@hooks/useColorMode'

export interface MethodStepProps {
    method: string
    ingredients: Ingredient[]
}

export default function MethodStep({ method, ingredients }: MethodStepProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack alignItems={'start'}>
            <Text color={keyColors.primary}>{method}</Text>
            <MethodIngredients ingredients={ingredients} />
        </VStack>
    )
}
