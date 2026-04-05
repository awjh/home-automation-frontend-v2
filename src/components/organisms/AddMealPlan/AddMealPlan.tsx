import { chakra, Flex, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import AddMealPlanForm, { type AddMealPlanFormProps } from './AddMealPlanForm'
import { type AddMealPlanFormValues } from './AddMealPlan.types'

interface AddMealPlanProps {
    date: string
    searchInternalRecipes?: AddMealPlanFormProps['searchInternalRecipes']
    onSubmit?: (values: AddMealPlanFormValues) => void | Promise<void>
}

export default function AddMealPlan({ date, searchInternalRecipes, onSubmit }: AddMealPlanProps) {
    const { keyColors } = useColorMode()

    return (
        <Flex position={'fixed'} w={'full'} zIndex={100} justifyContent={'center'}>
            <Flex
                position={'fixed'}
                left={0}
                top={0}
                right={0}
                bottom={0}
                justifyContent={'center'}
                alignItems={'center'}
                bg={keyColors.secondary}
                opacity={0.75}
            ></Flex>
            <chakra.form
                mt={20}
                zIndex={1}
                maxW={'450px'}
                w={'90%'}
                bg={keyColors.subtle}
                borderRadius={0}
                borderWidth={2}
                borderColor={keyColors.primary}
                display={'flex'}
                flexDirection={'column'}
                noValidate
                onSubmit={(event) => {
                    event.preventDefault()
                }}
            >
                <Text
                    color={keyColors.primary}
                    borderColor={keyColors.primary}
                    borderWidth={0}
                    borderBottomWidth={2}
                    w={'full'}
                    p={2}
                    fontSize={{ base: 'md', md: 'lg' }}
                >
                    Add meal for {date.split('-').reverse().join('/')}
                </Text>
                <Flex
                    p={2}
                    flexDirection={'column'}
                    justifyContent={'start'}
                    alignItems={'start'}
                    w={'full'}
                    gap={4}
                >
                    <AddMealPlanForm
                        searchInternalRecipes={searchInternalRecipes}
                        onSubmit={onSubmit}
                    />
                </Flex>
            </chakra.form>
        </Flex>
    )
}
