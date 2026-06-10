import TextInput from '@atoms/TextInput/TextInput'
import { Field, Grid, GridItem, IconButton } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { Fragment } from 'react'
import {
    Controller,
    type Control,
    type FieldPath,
    type FieldValues,
    type UseFormGetValues,
    type UseFormSetValue,
    type Path,
    useWatch,
} from 'react-hook-form'
import { LuMinus, LuPlus } from 'react-icons/lu'

interface MultipleEntryTextInputProps<
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues>,
> {
    control: Control<TFieldValues>
    getValues: UseFormGetValues<TFieldValues>
    name: TFieldName
    label: string
    itemName: string
    setValue: UseFormSetValue<TFieldValues>
    requiredMessage?: string
    minEntries?: number
    addIcon?: React.ReactNode
    deleteIcon?: React.ReactNode
}

export default function MultipleEntryTextInput<
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues>,
>(props: MultipleEntryTextInputProps<TFieldValues, TFieldName>) {
    const { keyColors } = useColorMode()
    const minEntries = props.minEntries ?? 1
    const watchedEntries = useWatch({ control: props.control, name: props.name }) as
        | string[]
        | undefined
    const fields = watchedEntries?.length
        ? watchedEntries
        : Array.from({ length: minEntries }, () => '')

    return (
        <Grid templateColumns={'1fr 0fr 0fr'} gap={4}>
            {fields.map((_, index) => {
                const isRequired = index < minEntries
                const currentEntries = (props.getValues(props.name) as string[] | undefined) ?? []

                return (
                    <Fragment key={`${props.name}-${index}`}>
                        <GridItem
                            alignItems={'start'}
                            gap={3}
                            justifyContent={'stretch'}
                            flexGrow={1}
                            colSpan={index !== fields.length - 1 || fields.length === 1 ? 2 : 1}
                        >
                            <Controller
                                name={`${props.name}.${index}` as Path<TFieldValues>}
                                control={props.control}
                                rules={{
                                    required: isRequired
                                        ? (props.requiredMessage ?? `${props.label} is required`)
                                        : undefined,
                                }}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        label={`${props.label}${fields.length > 1 ? ` ${index + 1}` : ''}`}
                                        type={'text'}
                                        required={isRequired}
                                        errorMessage={fieldState.error?.message}
                                        reserveErrorSpace={true}
                                        {...field}
                                    />
                                )}
                            />
                        </GridItem>
                        {index === fields.length - 1 && (
                            <GridItem>
                                <Field.Root required={false}>
                                    <Field.Label color={keyColors.primary} visibility={'hidden'}>
                                        &nbsp;
                                    </Field.Label>
                                    <IconButton
                                        aria-label={`add another ${props.itemName}`}
                                        color={keyColors.primary}
                                        _hover={{
                                            bg: keyColors.buttonHoverBg,
                                            color: keyColors.secondary,
                                        }}
                                        background={keyColors.secondary}
                                        borderWidth={2}
                                        borderColor={keyColors.primary}
                                        borderRadius={0}
                                        onClick={() => {
                                            const nextEntries = [...currentEntries, '']

                                            props.setValue(
                                                props.name,
                                                nextEntries as Parameters<typeof props.setValue>[1],
                                            )
                                        }}
                                        data-testid={`add-${props.itemName}-button`}
                                    >
                                        {props.addIcon ?? <LuPlus />}
                                    </IconButton>
                                </Field.Root>
                            </GridItem>
                        )}
                        {fields.length > minEntries ? (
                            <GridItem>
                                <Field.Root required={false}>
                                    <Field.Label color={keyColors.primary} visibility={'hidden'}>
                                        &nbsp;
                                    </Field.Label>
                                    <IconButton
                                        aria-label={`delete ${props.itemName}`}
                                        color={keyColors.primary}
                                        _hover={{
                                            bg: keyColors.buttonHoverBg,
                                            color: keyColors.secondary,
                                        }}
                                        background={keyColors.secondary}
                                        borderWidth={2}
                                        borderColor={keyColors.primary}
                                        borderRadius={0}
                                        onClick={() => {
                                            const nextEntries = currentEntries.filter(
                                                (_, currentIndex) => currentIndex !== index,
                                            )

                                            props.setValue(
                                                props.name,
                                                nextEntries as Parameters<typeof props.setValue>[1],
                                            )
                                        }}
                                        data-testid={`delete-${props.itemName}-button`}
                                    >
                                        {props.deleteIcon ?? <LuMinus />}
                                    </IconButton>
                                </Field.Root>
                            </GridItem>
                        ) : null}
                    </Fragment>
                )
            })}
        </Grid>
    )
}
