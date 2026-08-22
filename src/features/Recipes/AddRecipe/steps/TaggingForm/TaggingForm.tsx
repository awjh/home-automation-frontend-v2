import Tag from '@atoms/Tag/Tag'
import {
    Cuisine,
    Dietary,
    Equipment,
    MealType,
    Meat,
    Occasion,
    RecipeTags,
} from '@awjh/home-automation-v2-api-models/recipes'
import { Fieldset, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import {
    forwardRef,
    useImperativeHandle,
    useState,
    type Dispatch,
    type FormEvent,
    type SetStateAction,
} from 'react'

interface TaggingFormProps {
    initialValues?: RecipeTags
    onSubmitStep: (tags: RecipeTags) => void
}

function getEnumValues<T extends string>(enumObject: Record<string, string>) {
    return Object.values(enumObject).filter((value): value is T => typeof value === 'string')
}

const TaggingForm = forwardRef<{ submit: () => Promise<boolean> }, TaggingFormProps>(
    function TaggingForm(props, ref) {
        const { keyColors } = useColorMode()
        const cuisineOptions = getEnumValues<Cuisine>(Cuisine)
        const mealTypeOptions = getEnumValues<MealType>(MealType)
        const meatOptions = getEnumValues<Meat>(Meat)
        const dietaryOptions = getEnumValues<Dietary>(Dietary)
        const occasionOptions = getEnumValues<Occasion>(Occasion)
        const equipmentOptions = getEnumValues<Equipment>(Equipment)

        const [selectedCuisine, setSelectedCuisine] = useState<Set<Cuisine>>(
            new Set(props.initialValues?.cuisine ?? []),
        )
        const [selectedMealType, setSelectedMealType] = useState<Set<MealType>>(
            new Set(props.initialValues?.mealType ?? []),
        )
        const [selectedMeat, setSelectedMeat] = useState<Set<Meat>>(
            new Set(props.initialValues?.meat ?? []),
        )
        const [selectedDietary, setSelectedDietary] = useState<Set<Dietary>>(
            new Set(props.initialValues?.dietary ?? []),
        )
        const [selectedOccasion, setSelectedOccasion] = useState<Set<Occasion>>(
            new Set(props.initialValues?.occasion ?? []),
        )
        const [selectedEquipment, setSelectedEquipment] = useState<Set<Equipment>>(
            new Set(props.initialValues?.equipment ?? []),
        )

        useImperativeHandle(ref, () => ({
            submit: async () => {
                props.onSubmitStep({
                    cuisine: cuisineOptions.filter((value) => selectedCuisine.has(value)),
                    mealType: mealTypeOptions.filter((value) => selectedMealType.has(value)),
                    meat: meatOptions.filter((value) => selectedMeat.has(value)),
                    dietary: dietaryOptions.filter((value) => selectedDietary.has(value)),
                    occasion: occasionOptions.filter((value) => selectedOccasion.has(value)),
                    equipment: equipmentOptions.filter((value) => selectedEquipment.has(value)),
                })
                return true
            },
        }))

        const toggleSelection = <T extends string>(
            currentValues: Set<T>,
            setValues: Dispatch<SetStateAction<Set<T>>>,
            value: T,
        ) => {
            const nextValues = new Set(currentValues)

            if (nextValues.has(value)) {
                nextValues.delete(value)
            } else {
                nextValues.add(value)
            }

            setValues(nextValues)
        }

        const submitHandler = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()

            props.onSubmitStep({
                cuisine: cuisineOptions.filter((value) => selectedCuisine.has(value)),
                mealType: mealTypeOptions.filter((value) => selectedMealType.has(value)),
                meat: meatOptions.filter((value) => selectedMeat.has(value)),
                dietary: dietaryOptions.filter((value) => selectedDietary.has(value)),
                occasion: occasionOptions.filter((value) => selectedOccasion.has(value)),
                equipment: equipmentOptions.filter((value) => selectedEquipment.has(value)),
            })
        }

        const renderTagGroup = <T extends string>(
            groupLabel: string,
            options: T[],
            selectedValues: Set<T>,
            setValues: Dispatch<SetStateAction<Set<T>>>,
        ) => {
            return (
                <VStack alignItems={'stretch'} gap={2}>
                    <Text color={keyColors.primary} fontWeight={'bold'}>
                        {groupLabel}
                    </Text>
                    <Wrap gap={2}>
                        {options.map((option) => (
                            <WrapItem key={option}>
                                <Tag
                                    value={option}
                                    status={selectedValues.has(option) ? 'highlighted' : 'default'}
                                    onClick={() => {
                                        toggleSelection(selectedValues, setValues, option)
                                    }}
                                />
                            </WrapItem>
                        ))}
                    </Wrap>
                </VStack>
            )
        }

        return (
            <form noValidate onSubmit={submitHandler}>
                <Fieldset.Root size={'lg'} maxW={'full'}>
                    <VStack alignItems={'stretch'} gap={4}>
                        <Fieldset.Legend
                            color={keyColors.primary}
                            fontSize={'2xl'}
                            fontWeight={'bold'}
                            alignSelf={'start'}
                        >
                            Add Recipe Tags
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <VStack alignItems={'stretch'} gap={4}>
                                {renderTagGroup(
                                    'Cuisine',
                                    cuisineOptions,
                                    selectedCuisine,
                                    setSelectedCuisine,
                                )}
                                {renderTagGroup(
                                    'Meal Type',
                                    mealTypeOptions,
                                    selectedMealType,
                                    setSelectedMealType,
                                )}
                                {renderTagGroup('Meat', meatOptions, selectedMeat, setSelectedMeat)}
                                {renderTagGroup(
                                    'Dietary',
                                    dietaryOptions,
                                    selectedDietary,
                                    setSelectedDietary,
                                )}
                                {renderTagGroup(
                                    'Occasion',
                                    occasionOptions,
                                    selectedOccasion,
                                    setSelectedOccasion,
                                )}
                                {renderTagGroup(
                                    'Equipment',
                                    equipmentOptions,
                                    selectedEquipment,
                                    setSelectedEquipment,
                                )}
                            </VStack>
                        </Fieldset.Content>
                    </VStack>
                </Fieldset.Root>
            </form>
        )
    },
)

export default TaggingForm
