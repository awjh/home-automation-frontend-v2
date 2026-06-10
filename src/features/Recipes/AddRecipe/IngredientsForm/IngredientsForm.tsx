import { Fieldset, HStack, VStack } from '@chakra-ui/react'
import Button from '@atoms/Button/Button'
import useColorMode from '@hooks/useColorMode'
import { useFieldArray, useForm } from 'react-hook-form'
import IngredientsSectionForm, {
    createEmptyIngredient,
    createEmptySection,
    hasPendingDraftIngredient,
    trimTrailingEmptyIngredients,
    type IngredientsFormValues,
} from './IngredientsSectionForm/IngredientsSectionForm'

interface IngredientsFormProps {
    onNext: (values: IngredientsFormValues) => void
    onBack: () => void
}

export default function IngredientsForm(props: IngredientsFormProps) {
    const { keyColors } = useColorMode()
    const { control, handleSubmit, setFocus, setValue, trigger } = useForm<IngredientsFormValues>({
        defaultValues: {
            sections: [
                {
                    name: 'Main Recipe',
                    ingredients: [createEmptyIngredient()],
                },
            ],
        },
        mode: 'onTouched',
    })

    const {
        fields: sections,
        append: appendSection,
        remove: removeSection,
    } = useFieldArray({
        control,
        name: 'sections',
    })

    const submitHandler = (input: IngredientsFormValues) => {
        const hasDraftRowContent = input.sections.some((section) =>
            hasPendingDraftIngredient(section.ingredients),
        )

        if (hasDraftRowContent) {
            window.alert('Please clear the draft row or press Enter to add it before continuing.')
            return
        }

        props.onNext({
            sections: input.sections.map((section) => ({
                ...section,
                ingredients: trimTrailingEmptyIngredients(section.ingredients),
            })),
        })
    }

    const handleAddSection = () => {
        appendSection(createEmptySection(sections.length + 1))
    }

    return (
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
            <Fieldset.Root size={'lg'} maxW={'full'}>
                <VStack gap={4}>
                    <Fieldset.Legend
                        color={keyColors.primary}
                        fontSize={'2xl'}
                        fontWeight={'bold'}
                        alignSelf={'start'}
                    >
                        Add Recipe Ingredients
                    </Fieldset.Legend>
                    <Fieldset.Content>
                        <VStack gap={6} alignItems={'stretch'}>
                            {sections.map((section, sectionIndex) => (
                                <IngredientsSectionForm
                                    key={section.id}
                                    control={control}
                                    sectionIndex={sectionIndex}
                                    sectionCount={sections.length}
                                    onDeleteSection={() => {
                                        removeSection(sectionIndex)
                                    }}
                                    setValue={setValue}
                                    trigger={trigger}
                                    setFocus={setFocus}
                                />
                            ))}
                            <Button
                                type={'button'}
                                colorStyle={'secondary'}
                                onClick={handleAddSection}
                            >
                                Add Section
                            </Button>
                        </VStack>
                    </Fieldset.Content>
                </VStack>
                <HStack justifyContent={'space-between'}>
                    <Button type={'button'} colorStyle={'secondary'} onClick={props.onBack}>
                        Back
                    </Button>
                    <Button type={'submit'} colorStyle={'primary'}>
                        Next
                    </Button>
                </HStack>
            </Fieldset.Root>
        </form>
    )
}
