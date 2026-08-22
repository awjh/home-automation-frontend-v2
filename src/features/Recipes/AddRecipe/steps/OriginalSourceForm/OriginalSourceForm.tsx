import Button from '@atoms/Button/Button'
import SelectInput from '@atoms/SelectInput/SelectInput'
import TextInput from '@atoms/TextInput/TextInput'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { Fieldset, HStack, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import useToaster from '@hooks/useToaster'

export type OriginalSourceFormValues = {
    sourceType: SourceType
    title: string
    page: string
    series: string
    issue: string
    url: string
}

export interface OriginalSourceFormProps {
    initialValues?: OriginalSourceFormValues
    extractRecipeFromOnlineSource: (url: string) => Promise<void>
    isLookupLoading: (val: boolean) => void
    onSubmitStep: (values: OriginalSourceFormValues) => void
}

const OriginalSourceForm = forwardRef<{ submit: () => Promise<boolean> }, OriginalSourceFormProps>(
    function OriginalSourceForm(props, ref) {
        const { keyColors } = useColorMode()
        const toaster = useToaster()

        const originalSourceItems = Object.values([
            SourceType.ONLINE,
            SourceType.BOOK,
            SourceType.MAGAZINE,
        ]).map((sourceType) => ({
            label: sourceType,
            value: sourceType,
        }))

        const emptyValues = useMemo<OriginalSourceFormValues>(
            () => ({
                sourceType: SourceType.ONLINE,
                title: '',
                page: '',
                series: '',
                issue: '',
                url: '',
            }),
            [],
        )

        const { control, handleSubmit, reset, getValues } = useForm<OriginalSourceFormValues>({
            defaultValues: props.initialValues ?? emptyValues,
            mode: 'onTouched',
        })

        const [lookupLoading, setLookupLoading] = useState(false)

        useEffect(() => {
            props.isLookupLoading(lookupLoading)
        }, [lookupLoading, props])

        useImperativeHandle(ref, () => ({
            submit: () =>
                new Promise<boolean>((resolve) => {
                    handleSubmit(
                        (input) => {
                            props.onSubmitStep(input)
                            resolve(true)
                        },
                        () => resolve(false),
                    )()
                }),
        }))

        useEffect(() => {
            reset(props.initialValues ?? emptyValues)
        }, [emptyValues, props.initialValues, reset])

        const selectedSourceType = useWatch({ control, name: 'sourceType' })

        const submitHandler = (input: OriginalSourceFormValues) => {
            props.onSubmitStep(input)
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
                                        rules={{
                                            required: `${selectedSourceType} title is required`,
                                        }}
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
                            <HStack alignItems={'end'} w={'full'}>
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
                                <Button
                                    type={'button'}
                                    colorStyle={'secondary'}
                                    loading={lookupLoading}
                                    disabled={lookupLoading}
                                    onClick={async () => {
                                        setLookupLoading(true)

                                        try {
                                            await props.extractRecipeFromOnlineSource(
                                                getValues('url'),
                                            )
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        } catch (_error) {
                                            toaster.create({
                                                title: 'Failed to extract recipe',
                                                description:
                                                    'There was an error while extracting the recipe. Please try again.',
                                                type: 'error',
                                            })
                                            setLookupLoading(false)
                                            return
                                        }

                                        setLookupLoading(false)
                                        toaster.create({
                                            title: 'Recipe extracted successfully',
                                            description:
                                                'The recipe was extracted successfully. Please review the details before proceeding.',
                                            type: 'success',
                                        })
                                    }}
                                >
                                    Extract
                                </Button>
                            </HStack>
                        )}
                    </VStack>
                </Fieldset.Root>
            </form>
        )
    },
)

export default OriginalSourceForm
