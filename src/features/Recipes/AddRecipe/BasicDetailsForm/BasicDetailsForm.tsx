import Button from '@atoms/Button/Button'
import SelectInput from '@atoms/SelectInput/SelectInput'
import TextInput from '@atoms/TextInput/TextInput'
import { Fieldset, HStack, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import MultipleEntryTextInput from '../../../../components/molecules/MultipleEntryTextInput/MultipleEntryTextInput'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { LuUserMinus, LuUserPlus } from 'react-icons/lu'

export enum ProducesType {
    QUANTITY = 'quantity',
    PORTIONS = 'portions',
}

export type BasicDetailsFormValues = {
    recipeTitle: string
    authors: string[]
    image: string
    cookingDuration: string
    prepDuration: string
    standingTime: string
    producesType: ProducesType
    quantityProduced: string
    measureProduced: string
    serves: string
}

export interface BasicDetailsFormProps {
    onNext: (values: BasicDetailsFormValues) => void
    onBack: () => void
}

export default function BasicDetailsForm(props: BasicDetailsFormProps) {
    const { keyColors } = useColorMode()
    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<BasicDetailsFormValues>({
        defaultValues: {
            recipeTitle: '',
            authors: [''],
            image: '',
            cookingDuration: '',
            prepDuration: '',
            standingTime: '',
            producesType: ProducesType.PORTIONS,
        },
        mode: 'onTouched',
    })
    const selectedProducesType = useWatch({ control, name: 'producesType' })

    const submitHandler = (input: BasicDetailsFormValues) => {
        props.onNext(input)
    }

    return (
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
            <Fieldset.Root size={'lg'} maxW={'md'}>
                <VStack gap={4}>
                    <Fieldset.Legend
                        color={keyColors.primary}
                        fontSize={'2xl'}
                        fontWeight={'bold'}
                        alignSelf={'start'}
                    >
                        Basic Details
                    </Fieldset.Legend>
                    <Fieldset.Content>
                        <VStack gap={4} alignItems={'stretch'}>
                            <Controller
                                name="recipeTitle"
                                control={control}
                                rules={{ required: 'Recipe title is required' }}
                                render={({ field }) => (
                                    <TextInput
                                        label={'Recipe Title'}
                                        type={'text'}
                                        required
                                        errorMessage={errors.recipeTitle?.message}
                                        {...field}
                                    />
                                )}
                            />
                            <MultipleEntryTextInput
                                control={control}
                                getValues={getValues}
                                name={'authors'}
                                label={'Recipe Author'}
                                itemName={'author'}
                                setValue={setValue}
                                requiredMessage={'At least one author is required'}
                                addIcon={<LuUserPlus />}
                                deleteIcon={<LuUserMinus />}
                            />
                            <Controller
                                name={'image'}
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        label={`Recipe Image`}
                                        type={'text'}
                                        required={false}
                                        errorMessage={errors.image?.message}
                                        {...field}
                                    />
                                )}
                            />
                            <Controller
                                name={'cookingDuration'}
                                control={control}
                                rules={{ required: 'Cooking duration is required' }}
                                render={({ field }) => (
                                    <TextInput
                                        label={`Cooking Duration (minutes)`}
                                        type={'number'}
                                        required
                                        errorMessage={errors.cookingDuration?.message}
                                        {...field}
                                    />
                                )}
                            />
                            <Controller
                                name={'prepDuration'}
                                control={control}
                                rules={{ required: 'Preparation duration is required' }}
                                render={({ field }) => (
                                    <TextInput
                                        label={`Preparation Duration (minutes)`}
                                        type={'number'}
                                        required
                                        errorMessage={errors.prepDuration?.message}
                                        {...field}
                                    />
                                )}
                            />
                            <Controller
                                name={'standingTime'}
                                control={control}
                                rules={{ required: 'Standing time is required' }}
                                render={({ field }) => (
                                    <TextInput
                                        label={`Standing Time (minutes)`}
                                        type={'number'}
                                        required
                                        errorMessage={errors.standingTime?.message}
                                        {...field}
                                    />
                                )}
                            />
                            <Controller
                                name={'producesType'}
                                control={control}
                                render={({ field }) => (
                                    <SelectInput
                                        label={'What does this recipe produce?'}
                                        options={Object.values(ProducesType).map((value) => ({
                                            label: value,
                                            value: value,
                                        }))}
                                        {...field}
                                    />
                                )}
                            />
                            {selectedProducesType === ProducesType.QUANTITY ? (
                                <>
                                    <Controller
                                        name={'quantityProduced'}
                                        control={control}
                                        rules={{ required: 'Quantity produced is required' }}
                                        render={({ field }) => (
                                            <TextInput
                                                label={`Quantity Produced`}
                                                type={'number'}
                                                required
                                                errorMessage={errors.quantityProduced?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={'measureProduced'}
                                        control={control}
                                        rules={{ required: 'Measure produced is required' }}
                                        render={({ field }) => (
                                            <TextInput
                                                label={`Measure Produced`}
                                                type={'text'}
                                                required
                                                errorMessage={errors.measureProduced?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </>
                            ) : (
                                <Controller
                                    name={'serves'}
                                    control={control}
                                    rules={{ required: 'Number of portions is required' }}
                                    render={({ field }) => (
                                        <TextInput
                                            label={`Serves (number of portions)`}
                                            type={'number'}
                                            required
                                            errorMessage={errors.serves?.message}
                                            {...field}
                                        />
                                    )}
                                />
                            )}
                            <HStack justifyContent={'space-between'}>
                                <Button
                                    type={'button'}
                                    colorStyle={'secondary'}
                                    onClick={props.onBack}
                                >
                                    Back
                                </Button>
                                <Button type={'submit'} colorStyle={'primary'}>
                                    Next
                                </Button>
                            </HStack>
                        </VStack>
                    </Fieldset.Content>
                </VStack>
            </Fieldset.Root>
        </form>
    )
}
