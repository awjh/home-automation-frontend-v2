// Feature: Add Meal Plan
// Placeholder for the add meal plan feature UI and logic.

'use client'

import { chakra, Flex, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import AddMealPlanForm from './AddMealPlanForm/AddMealPlanForm'
import { SearchInternalRecipes } from './AddMealPlanForm/steps/AddMealPlanInternalRecipeStep/AddMealPlanInternalRecipeStep'
import AddMealPlanFormValues from './AddMealPlanForm/defs/AddMealPlanFormValues'
import { GetExtractedExternalRecipeResponse } from '@awjh/home-automation-v2-api-models'

interface AddMealPlanProps {
    date: string
    extractTitleFromOnlineSource: (url: string) => Promise<GetExtractedExternalRecipeResponse>
    initialValues?: Partial<AddMealPlanFormValues>
    mode: 'add' | 'edit'
    searchInternalRecipes: SearchInternalRecipes
    onSubmit: (values: AddMealPlanFormValues) => void | Promise<void>
    onClose: () => void
}

export default function AddMealPlan(props: AddMealPlanProps) {
    const { keyColors } = useColorMode()
    const headingPrefix = props.mode === 'edit' ? 'Edit meal for' : 'Add meal for'
    const formKey = `${props.mode ?? 'add'}:${props.date}:${JSON.stringify(props.initialValues ?? {})}`

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
                onClick={props.onClose}
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
                    {headingPrefix} {props.date.split('-').reverse().join('/')}
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
                        key={formKey}
                        initialValues={props.initialValues}
                        isMealTimeEditable={props.mode === 'add'}
                        searchInternalRecipes={props.searchInternalRecipes}
                        extractTitleFromOnlineSource={props.extractTitleFromOnlineSource}
                        onSubmit={props.onSubmit}
                        onCancel={props.onClose}
                    />
                </Flex>
            </chakra.form>
        </Flex>
    )
}
