import Button from '@atoms/Button/Button'
import SelectInput from '@atoms/SelectInput/SelectInput'
import TextInput from '@atoms/TextInput/TextInput'
import { Field, HStack, Text, VStack } from '@chakra-ui/react'
import {
    HasImageOption,
    ImageFormValues,
    ImageSourceOption,
} from '@features/Recipes/AddRecipe/steps/ImageForm/ImageForm'
import useColorMode from '@hooks/useColorMode'
import PopupForm from '@molecules/PopupForm/PopupForm'
import { Controller, useForm, useWatch } from 'react-hook-form'

export enum RemoveImageOption {
    YES = 'yes',
    NO = 'no',
}

type EditRecipeImageFormValues = {
    removeImage: RemoveImageOption
    imageSource: ImageSourceOption
    imageUrl: string
    imageFile: File | null
}

export interface EditRecipeImageProps {
    hasImage: boolean
    onSubmit: (values: ImageFormValues) => Promise<void>
    onClose: () => void
}

export default function EditRecipeImage({ hasImage, onSubmit, onClose }: EditRecipeImageProps) {
    const { keyColors } = useColorMode()

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EditRecipeImageFormValues>({
        defaultValues: {
            removeImage: RemoveImageOption.NO,
            imageSource: ImageSourceOption.UPLOAD,
            imageUrl: '',
            imageFile: null,
        },
        mode: 'onTouched',
    })

    const removeImage = useWatch({ control, name: 'removeImage' })
    const imageSource = useWatch({ control, name: 'imageSource' })
    const imageFile = useWatch({ control, name: 'imageFile' })
    const isReplacingImage = !hasImage || removeImage === RemoveImageOption.NO

    const submitHandler = ({ imageSource, imageUrl, imageFile }: EditRecipeImageFormValues) =>
        onSubmit({
            hasImage: isReplacingImage ? HasImageOption.YES : HasImageOption.NO,
            imageSource,
            imageUrl,
            imageFile,
        })

    return (
        <PopupForm
            dataProps={{ testid: 'edit-recipe-image-popup' }}
            heading={hasImage ? 'Change Image' : 'Add Image'}
            onClose={onClose}
        >
            <form noValidate onSubmit={handleSubmit(submitHandler)} style={{ width: '100%' }}>
                <VStack gap={4} alignItems={'stretch'}>
                    {hasImage && (
                        <Controller
                            name={'removeImage'}
                            control={control}
                            render={({ field }) => (
                                <SelectInput
                                    label={'Would you like to remove the image?'}
                                    options={[
                                        { label: 'No', value: RemoveImageOption.NO },
                                        { label: 'Yes', value: RemoveImageOption.YES },
                                    ]}
                                    {...field}
                                />
                            )}
                        />
                    )}
                    {isReplacingImage && (
                        <>
                            <Controller
                                name={'imageSource'}
                                control={control}
                                render={({ field }) => (
                                    <SelectInput
                                        label={'How would you like to provide the image?'}
                                        options={[
                                            { label: 'Upload', value: ImageSourceOption.UPLOAD },
                                            { label: 'Url', value: ImageSourceOption.URL },
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
                                            isReplacingImage && !value
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
                                            isReplacingImage && !value
                                                ? 'Image file is required'
                                                : true,
                                    }}
                                    render={({ field: { onChange, onBlur, name, ref } }) => (
                                        <Field.Root required invalid={!!errors.imageFile}>
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
                                                    onChange(event.target.files?.[0] ?? null)
                                                }
                                            />
                                            {imageFile && (
                                                <Text color={keyColors.primary} fontSize={'sm'}>
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
                    <HStack w={'full'} justifyContent={'space-between'}>
                        <Button type={'button'} colorStyle={'secondary'} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type={'submit'} loading={isSubmitting}>
                            {isReplacingImage ? 'Save' : 'Remove'}
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </PopupForm>
    )
}
