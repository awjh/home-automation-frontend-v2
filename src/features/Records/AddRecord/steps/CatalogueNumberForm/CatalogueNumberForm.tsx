import Button from '@atoms/Button/Button'
import TextInput from '@atoms/TextInput/TextInput'
import { GetExternalRecordsResponse } from '@awjh/home-automation-v2-api-models'
import { Field, Fieldset, HStack, Text, VStack } from '@chakra-ui/react'
import {
    ExternalRecordSearchResult,
    getExternalRecordKey,
    getExternalRecordSource,
    type ExternalRecordSource,
} from '@defs/ExternalRecord'
import useColorMode from '@hooks/useColorMode'
import useToaster from '@hooks/useToaster'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ExternalRecordOption from './ExternalRecordOption/ExternalRecordOption'

export type CatalogueNumberFormValues = {
    catNo: string
}

// The releases found for the last search, kept so they are still there after going back a step
export type ExternalRecordSearch = {
    results: GetExternalRecordsResponse
    // From getExternalRecordKey, as MusicBrainz and Discogs IDs could clash
    selectedKey?: string
}

export interface CatalogueNumberFormProps {
    initialValues?: CatalogueNumberFormValues
    initialSearch?: ExternalRecordSearch
    searchByCatalogueNumber: (catNo: string) => Promise<GetExternalRecordsResponse>
    // Fills in the rest of the form from the chosen release
    selectExternalRecord: (release: ExternalRecordSource) => Promise<void>
    isLookupLoading: (val: boolean) => void
    onSubmitStep: (values: CatalogueNumberFormValues) => void
}

const CatalogueNumberForm = forwardRef<
    { submit: () => Promise<boolean> },
    CatalogueNumberFormProps
>(function CatalogueNumberForm(props, ref) {
    const { keyColors } = useColorMode()
    const toaster = useToaster()

    const emptyValues = useMemo<CatalogueNumberFormValues>(() => ({ catNo: '' }), [])

    const { control, handleSubmit, reset, trigger, getValues } = useForm<CatalogueNumberFormValues>(
        {
            defaultValues: props.initialValues ?? emptyValues,
            mode: 'onTouched',
        },
    )

    const [search, setSearch] = useState<ExternalRecordSearch | undefined>(props.initialSearch)
    const [lookupLoading, setLookupLoading] = useState(false)
    const [loadingKey, setLoadingKey] = useState<string>()
    const isBusy = lookupLoading || loadingKey !== undefined

    useEffect(() => {
        props.isLookupLoading(isBusy)
    }, [isBusy, props])

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

    const searchCatalogueNumber = async () => {
        if (!(await trigger('catNo'))) {
            return
        }

        const catNo = getValues('catNo').trim()

        setLookupLoading(true)

        let results: GetExternalRecordsResponse

        try {
            results = await props.searchByCatalogueNumber(catNo)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            toaster.create({
                title: 'Failed to search for record',
                description: 'There was an error while searching for the record. Please try again.',
                type: 'error',
            })
            setLookupLoading(false)
            return
        }

        setLookupLoading(false)
        setSearch({ results })

        // Keep the catalogue number when moving on, even if Next isn't pressed straight away
        props.onSubmitStep({ catNo })

        if (results.length === 0) {
            toaster.create({
                title: 'No record found',
                description: `Nothing matched ${catNo}. You can enter the details manually.`,
                type: 'info',
            })
        }
    }

    const selectRelease = async (release: ExternalRecordSearchResult) => {
        const key = getExternalRecordKey(release)

        setLoadingKey(key)

        try {
            await props.selectExternalRecord(getExternalRecordSource(release))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            toaster.create({
                title: 'Failed to get record details',
                description:
                    'There was an error while getting the record details. Please try again.',
                type: 'error',
            })
            return
        } finally {
            setLoadingKey(undefined)
        }

        setSearch((current) => current && { ...current, selectedKey: key })

        toaster.create({
            title: 'Record details filled in',
            description: 'Please review them before proceeding.',
            type: 'success',
        })
    }

    return (
        <form
            noValidate
            onSubmit={(event) => {
                event.preventDefault()
                void searchCatalogueNumber()
            }}
        >
            <Fieldset.Root size={'lg'} maxW={'md'}>
                <VStack gap={4} alignItems={'stretch'}>
                    <Fieldset.Legend
                        color={keyColors.primary}
                        fontSize={'2xl'}
                        fontWeight={'bold'}
                        alignSelf={'start'}
                    >
                        Catalogue Number
                    </Fieldset.Legend>
                    <Text color={keyColors.primary}>
                        Search by the catalogue number printed on the sleeve or label to fill in the
                        record&apos;s details.
                    </Text>
                    <Fieldset.Content>
                        <HStack alignItems={'start'} w={'full'}>
                            <Controller
                                name={'catNo'}
                                control={control}
                                rules={{
                                    validate: (value) =>
                                        value.trim().length > 0 || 'Catalogue number is required',
                                }}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        type={'text'}
                                        label={'Catalogue Number'}
                                        required={true}
                                        errorMessage={fieldState.error?.message}
                                        {...field}
                                    />
                                )}
                            />
                            {/* Hidden label keeps the button level with the input when an error shows */}
                            <Field.Root w={'auto'}>
                                <Field.Label visibility={'hidden'}>&nbsp;</Field.Label>
                                <Button
                                    type={'button'}
                                    colorStyle={'secondary'}
                                    loading={lookupLoading}
                                    disabled={isBusy}
                                    onClick={() => void searchCatalogueNumber()}
                                >
                                    Search
                                </Button>
                            </Field.Root>
                        </HStack>
                    </Fieldset.Content>
                    {search && search.results.length > 0 && (
                        <VStack alignItems={'stretch'} gap={2}>
                            <Text color={keyColors.primary}>
                                Choose the pressing that matches your record.
                            </Text>
                            {search.results.map((release) => {
                                const key = getExternalRecordKey(release)

                                return (
                                    <ExternalRecordOption
                                        key={key}
                                        release={release}
                                        isSelected={search.selectedKey === key}
                                        isLoading={loadingKey === key}
                                        disabled={isBusy}
                                        onSelect={() => void selectRelease(release)}
                                    />
                                )
                            })}
                        </VStack>
                    )}
                </VStack>
            </Fieldset.Root>
        </form>
    )
})

export default CatalogueNumberForm
