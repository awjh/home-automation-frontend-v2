import { Recipe } from '@awjh/home-automation-v2-api-models/recipes'
import { HStack, Text, VStack } from '@chakra-ui/react'
import MethodStep from '../MethodStep/MethodStep'
import useColorMode from '@hooks/useColorMode'

export type RecipeMethodProps = Pick<Recipe, 'method'>

export default function RecipeMethod({ method }: RecipeMethodProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack
            alignItems={'start'}
            gap={4}
            w={'full'}
            minW={0}
            fontSize={{ base: 'sm', md: 'md' }}
        >
            {method.map((methodStep, index) => (
                <HStack
                    key={`method-step-${index}`}
                    alignItems={'start'}
                    gap={4}
                    w={'full'}
                    minW={0}
                >
                    <Text color={keyColors.primary}>{`${index + 1}`.padStart(2, '0')}</Text>
                    <MethodStep method={methodStep.text} ingredients={methodStep.ingredients} />
                </HStack>
            ))}
        </VStack>
    )
}
