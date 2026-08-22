import SelectInput from '@atoms/SelectInput/SelectInput'
import TextInput from '@atoms/TextInput/TextInput'
import { Field, Fieldset, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

export enum HasImageOption {
    YES = 'yes',
    NO = 'no',
}

export enum ImageSourceOption {
    URL = 'url',
    UPLOAD = 'upload',
}

export type ImageFormValues = {
    hasImage: HasImageOption
    imageSource: ImageSourceOption
    imageUrl: string
    imageFile: File | null
}

export interface ImageFormProps {
    initialValues?: ImageFormValues
    onSubmitStep: (values: ImageFormValues) => void
}

const ImageForm = forwardRef<{ submit: () => Promise<boolean> }, ImageFormProps>(
    function ImageForm(props, ref) {
        const { keyColors } = useColorMode()

        const emptyValues = useMemo<ImageFormValues>(
            () => ({
                hasImage: HasImageOption.NO,
                imageSource: ImageSourceOption.URL,
                imageUrl: '',
                imageFile: null,
            }),
            [],
        )

        const {
            control,
            handleSubmit,
            reset,
            formState: { errors },
        } = useForm<ImageFormValues>({
            defaultValues: props.initialValues ?? emptyValues,
            mode: 'onTouched',
        })

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

        const hasImage = useWatch({ control, name: 'hasImage' })
        const imageSource = useWatch({ control, name: 'imageSource' })
        const imageFile = useWatch({ control, name: 'imageFile' })

        const submitHandler = (input: ImageFormValues) => {
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
                            Recipe Image
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <VStack gap={4} alignItems={'stretch'}>
                                <Controller
                                    name={'hasImage'}
                                    control={control}
                                    render={({ field }) => (
                                        <SelectInput
                                            label={'Would you like to add an image?'}
                                            options={[
                                                { label: 'Yes', value: HasImageOption.YES },
                                                { label: 'No', value: HasImageOption.NO },
                                            ]}
                                            {...field}
                                        />
                                    )}
                                />
                                {hasImage === HasImageOption.YES && (
                                    <>
                                        <Controller
                                            name={'imageSource'}
                                            control={control}
                                            render={({ field }) => (
                                                <SelectInput
                                                    label={
                                                        'How would you like to provide the image?'
                                                    }
                                                    options={[
                                                        {
                                                            label: 'Url',
                                                            value: ImageSourceOption.URL,
                                                        },
                                                        {
                                                            label: 'Upload',
                                                            value: ImageSourceOption.UPLOAD,
                                                        },
                                                    ]}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {imageSource === ImageSourceOption.URL ? (
                                            <Controller
                                                name={'imageUrl'}
                                                control={control}
                                                rules={{
                                                    validate: (value) =>
                                                        hasImage === HasImageOption.YES &&
                                                        imageSource === ImageSourceOption.URL &&
                                                        !value
                                                            ? 'Image URL is required'
                                                            : true,
                                                }}
                                                render={({ field }) => (
                                                    <TextInput
                                                        label={'Image URL'}
                                                        type={'text'}
                                                        required
                                                        errorMessage={errors.imageUrl?.message}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        ) : (
                                            <Controller
                                                name={'imageFile'}
                                                control={control}
                                                rules={{
                                                    validate: (value) =>
                                                        hasImage === HasImageOption.YES &&
                                                        imageSource === ImageSourceOption.UPLOAD &&
                                                        !value
                                                            ? 'Image file is required'
                                                            : true,
                                                }}
                                                render={({
                                                    field: { onChange, onBlur, name, ref },
                                                }) => (
                                                    <Field.Root
                                                        required
                                                        invalid={!!errors.imageFile}
                                                    >
                                                        <Field.Label
                                                            color={keyColors.primary}
                                                            textTransform={'capitalize'}
                                                        >
                                                            Image File
                                                            <Field.RequiredIndicator />
                                                        </Field.Label>
                                                        <input
                                                            ref={ref}
                                                            name={name}
                                                            type={'file'}
                                                            accept={'image/*'}
                                                            aria-label={'Image File'}
                                                            onBlur={onBlur}
                                                            onChange={(event) =>
                                                                onChange(
                                                                    event.target.files?.[0] ?? null,
                                                                )
                                                            }
                                                        />
                                                        {imageFile && (
                                                            <Text
                                                                color={keyColors.primary}
                                                                fontSize={'sm'}
                                                            >
                                                                {imageFile.name}
                                                            </Text>
                                                        )}
                                                        {errors.imageFile && (
                                                            <Field.ErrorText>
                                                                {errors.imageFile.message}
                                                            </Field.ErrorText>
                                                        )}
                                                    </Field.Root>
                                                )}
                                            />
                                        )}
                                    </>
                                )}
                            </VStack>
                        </Fieldset.Content>
                    </VStack>
                </Fieldset.Root>
            </form>
        )
    },
)

export default ImageForm
