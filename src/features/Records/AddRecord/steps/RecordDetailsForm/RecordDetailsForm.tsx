import SelectInput from '@atoms/SelectInput/SelectInput'
import TextInput from '@atoms/TextInput/TextInput'
import { RecordFormat, ReleaseType } from '@awjh/home-automation-v2-api-models/records'
import { Fieldset, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import MultipleEntryTextInput from '@molecules/MultipleEntryTextInput/MultipleEntryTextInput'
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { LuUserMinus, LuUserPlus } from 'react-icons/lu'

export type RecordDetailsFormValues = {
    title: string
    artists: string[]
    labels: string[]
    year: string
    type: ReleaseType
    format: RecordFormat
}

export const RELEASE_TYPE_LABELS: Record<ReleaseType, string> = {
    [ReleaseType.ALBUM]: 'Album',
    [ReleaseType.EP]: 'EP',
    [ReleaseType.SINGLE]: 'Single',
    [ReleaseType.NON_MUSIC]: 'Non-Music',
}

export function createEmptyRecordDetails(): RecordDetailsFormValues {
    return {
        title: '',
        artists: [''],
        labels: [''],
        year: '',
        type: ReleaseType.ALBUM,
        format: RecordFormat.TWELVE_INCH,
    }
}

export interface RecordDetailsFormProps {
    initialValues?: RecordDetailsFormValues
    onSubmitStep: (values: RecordDetailsFormValues) => void
}

const RecordDetailsForm = forwardRef<{ submit: () => Promise<boolean> }, RecordDetailsFormProps>(
    function RecordDetailsForm(props, ref) {
        const { keyColors } = useColorMode()
        const emptyValues = useMemo(() => createEmptyRecordDetails(), [])

        const { control, handleSubmit, getValues, setValue, reset } =
            useForm<RecordDetailsFormValues>({
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

        return (
            <form noValidate onSubmit={handleSubmit(props.onSubmitStep)}>
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
                                    name={'title'}
                                    control={control}
                                    rules={{ required: 'Title is required' }}
                                    render={({ field, fieldState }) => (
                                        <TextInput
                                            label={'Title'}
                                            type={'text'}
                                            required
                                            errorMessage={fieldState.error?.message}
                                            {...field}
                                        />
                                    )}
                                />
                                <MultipleEntryTextInput
                                    control={control}
                                    getValues={getValues}
                                    name={'artists'}
                                    label={'Artist'}
                                    itemName={'artist'}
                                    setValue={setValue}
                                    requiredMessage={'At least one artist is required'}
                                    addIcon={<LuUserPlus />}
                                    deleteIcon={<LuUserMinus />}
                                />
                                <MultipleEntryTextInput
                                    control={control}
                                    getValues={getValues}
                                    name={'labels'}
                                    label={'Label'}
                                    itemName={'label'}
                                    setValue={setValue}
                                    requiredMessage={'At least one label is required'}
                                />
                                <Controller
                                    name={'year'}
                                    control={control}
                                    rules={{
                                        required: 'Year is required',
                                        pattern: {
                                            value: /^\d{4}$/,
                                            message: 'Year must be four digits',
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextInput
                                            label={'Year'}
                                            type={'number'}
                                            required
                                            errorMessage={fieldState.error?.message}
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name={'type'}
                                    control={control}
                                    render={({ field }) => (
                                        <SelectInput
                                            label={'Release Type'}
                                            options={Object.values(ReleaseType).map((value) => ({
                                                label: RELEASE_TYPE_LABELS[value],
                                                value,
                                            }))}
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name={'format'}
                                    control={control}
                                    render={({ field }) => (
                                        <SelectInput
                                            label={'Format'}
                                            options={Object.values(RecordFormat).map((value) => ({
                                                label: value,
                                                value,
                                            }))}
                                            {...field}
                                        />
                                    )}
                                />
                            </VStack>
                        </Fieldset.Content>
                    </VStack>
                </Fieldset.Root>
            </form>
        )
    },
)

export default RecordDetailsForm
