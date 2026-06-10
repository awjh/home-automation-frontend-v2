import Button from '@atoms/Button/Button'
import SelectInput from '@atoms/SelectInput/SelectInput'
import TextInput from '@atoms/TextInput/TextInput'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Fieldset, HStack, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { Controller, useForm, useWatch } from 'react-hook-form'

type OriginalSourceFormValues = {
    sourceType: SourceType
    title: string
    page: string
    series: string
    issue: string
    url: string
}

export interface OriginalSourceFormProps {
    onNext: (values: OriginalSourceFormValues) => void
    onBack: () => void
}

export default function OriginalSourceForm(props: OriginalSourceFormProps) {
    const { keyColors } = useColorMode()
    const originalSourceItems = Object.values([
        SourceType.ONLINE,
        SourceType.BOOK,
        SourceType.MAGAZINE,
    ]).map((sourceType) => ({
        label: sourceType,
        value: sourceType,
    }))

    const { control, handleSubmit } = useForm<OriginalSourceFormValues>({
        defaultValues: {
            sourceType: SourceType.ONLINE,
            title: '',
            page: '',
            series: '',
            issue: '',
            url: '',
        },
        mode: 'onTouched',
    })

    const selectedSourceType = useWatch({ control, name: 'sourceType' })

    const submitHandler = (input: OriginalSourceFormValues) => {
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
                        Original Source
                    </Fieldset.Legend>
                    <Fieldset.Content>
                        <VStack gap={4} alignItems={'stretch'}>
                            <Controller
                                name={'sourceType'}
                                control={control}
                                render={({ field }) => (
                                    <SelectInput
                                        label={'Where is the recipe originally from?'}
                                        options={originalSourceItems}
                                        {...field}
                                    />
                                )}
                            />
                        </VStack>
                    </Fieldset.Content>
                    {(selectedSourceType === SourceType.BOOK ||
                        selectedSourceType === SourceType.MAGAZINE) && (
                        <Fieldset.Content>
                            <VStack gap={4} alignItems={'stretch'}>
                                <Controller
                                    name={'title'}
                                    control={control}
                                    rules={{ required: `${selectedSourceType} title is required` }}
                                    render={({ field, fieldState }) => (
                                        <TextInput
                                            type={'text'}
                                            label={`${selectedSourceType} Title`}
                                            required
                                            errorMessage={fieldState.error?.message}
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name={'page'}
                                    control={control}
                                    rules={{ required: 'Page number is required' }}
                                    render={({ field, fieldState }) => (
                                        <TextInput
                                            type={'number'}
                                            label={'Page Number'}
                                            required
                                            errorMessage={fieldState.error?.message}
                                            {...field}
                                        />
                                    )}
                                />
                            </VStack>
                        </Fieldset.Content>
                    )}
                    {selectedSourceType === SourceType.BOOK && (
                        <Controller
                            name={'series'}
                            control={control}
                            render={({ field }) => (
                                <TextInput
                                    type={'text'}
                                    label={'Series'}
                                    required={false}
                                    {...field}
                                />
                            )}
                        />
                    )}
                    {selectedSourceType === SourceType.MAGAZINE && (
                        <Controller
                            name={'issue'}
                            control={control}
                            rules={{ required: 'Issue is required' }}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    type={'text'}
                                    label={'Issue'}
                                    required={true}
                                    errorMessage={fieldState.error?.message}
                                    {...field}
                                />
                            )}
                        />
                    )}
                    {selectedSourceType === SourceType.ONLINE && (
                        <Controller
                            name={'url'}
                            control={control}
                            rules={{ required: 'URL is required' }}
                            render={({ field, fieldState }) => (
                                <TextInput
                                    type={'text'}
                                    label={'URL'}
                                    required={true}
                                    errorMessage={fieldState.error?.message}
                                    {...field}
                                />
                            )}
                        />
                    )}
                    <HStack w={'full'} justifyContent={'space-between'}>
                        <Button type={'button'} colorStyle={'secondary'} onClick={props.onBack}>
                            Back
                        </Button>
                        <Button type={'submit'} colorStyle={'primary'}>
                            Next
                        </Button>
                    </HStack>
                </VStack>
            </Fieldset.Root>
        </form>
    )
}
