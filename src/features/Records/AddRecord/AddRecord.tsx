'use client'

import Button from '@atoms/Button/Button'
import {
    GetExternalRecordsResponse,
    PostRecordBody,
    PostRecordResponse,
    PutRecordBody,
    PutRecordResponse,
} from '@awjh/home-automation-v2-api-models'
import { MusicRecord, RecordTags } from '@awjh/home-automation-v2-api-models/records'
import { HStack, Text, VStack } from '@chakra-ui/react'
import {
    isSupportedImageContentType,
    UploadRecipeImageInput,
    UploadRecipeImageResponse,
} from '@defs/Image'
import { RecordLookupResult } from '@defs/RecordLookup'
import ImageForm, {
    HasImageOption,
    ImageFormValues,
    ImageSourceOption,
} from '@features/Recipes/AddRecipe/steps/ImageForm/ImageForm'
import useColorMode from '@hooks/useColorMode'
import fileToBase64 from '@utils/fileToBase64'
import formatTrackDuration from '@utils/formatTrackDuration'
import parseTrackDuration from '@utils/parseTrackDuration'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import CatalogueNumberForm, {
    CatalogueNumberFormValues,
    ExternalRecordSearch,
} from './steps/CatalogueNumberForm/CatalogueNumberForm'
import RecordDetailsForm, {
    createEmptyRecordDetails,
    RecordDetailsFormValues,
} from './steps/RecordDetailsForm/RecordDetailsForm'
import RecordTaggingForm from './steps/RecordTaggingForm/RecordTaggingForm'
import { TracksFormValues } from './steps/TracksForm/SideForm/SideForm'
import TracksForm from './steps/TracksForm/TracksForm'

type AddRecordState = {
    catalogueNumber?: CatalogueNumberFormValues
    externalSearch?: ExternalRecordSearch
    details?: RecordDetailsFormValues
    image?: ImageFormValues
    tracks?: TracksFormValues
    tags?: RecordTags
}

type AddRecordSharedProps = {
    searchExternalRecords: (catNo: string) => Promise<GetExternalRecordsResponse>
    getExternalRecord: (musicBrainzId: string) => Promise<RecordLookupResult>
}

type AddRecordCreateProps = AddRecordSharedProps & {
    record?: never
    addRecord: (record: PostRecordBody) => Promise<PostRecordResponse>
    uploadRecordImage: (input: UploadRecipeImageInput) => Promise<UploadRecipeImageResponse>
    editRecord?: never
}

type AddRecordEditProps = AddRecordSharedProps & {
    record: MusicRecord
    editRecord: (recordId: string, record: PutRecordBody) => Promise<PutRecordResponse>
    addRecord?: never
    uploadRecordImage?: never
}

export type AddRecordProps = AddRecordCreateProps | AddRecordEditProps

type AddRecordStepKey = 'catalogueNumber' | 'details' | 'image' | 'tracks' | 'tagging'

// Only overwrites the steps the lookup has data for, so anything already entered is kept
function mapLookupToFormState(
    lookup: RecordLookupResult,
    currentValues: AddRecordState,
): AddRecordState {
    const currentDetails = currentValues.details ?? createEmptyRecordDetails()

    return {
        ...currentValues,
        details: {
            title: lookup.title ?? currentDetails.title,
            artists: lookup.artists?.length ? lookup.artists : currentDetails.artists,
            labels: lookup.labels?.length ? lookup.labels : currentDetails.labels,
            year: lookup.year !== undefined ? String(lookup.year) : currentDetails.year,
            type: lookup.type ?? currentDetails.type,
            format: lookup.format ?? currentDetails.format,
        },
        tracks: lookup.sides?.length
            ? {
                  sides: lookup.sides.map((side) => ({
                      name: side.name,
                      songs: side.songs.map((song) => ({
                          title: song.title,
                          duration: formatTrackDuration(song.duration),
                      })),
                  })),
              }
            : currentValues.tracks,
        image: lookup.imageUrl
            ? {
                  hasImage: HasImageOption.YES,
                  imageSource: ImageSourceOption.URL,
                  imageUrl: lookup.imageUrl,
                  imageFile: null,
              }
            : currentValues.image,
        tags: lookup.tags ?? currentValues.tags,
    }
}

export function mapRecordToFormState(record?: MusicRecord): AddRecordState {
    if (!record) {
        return {}
    }

    return mapLookupToFormState(record, { catalogueNumber: { catNo: record.catNo } })
}

function buildPostRecordBody(formValues: AddRecordState, imageKey?: string): PostRecordBody {
    const { catalogueNumber, details, tracks, tags } = formValues

    return {
        catNo: catalogueNumber?.catNo.trim() ?? '',
        title: details?.title.trim() ?? '',
        artists: (details?.artists ?? []).map((artist) => artist.trim()).filter(Boolean),
        labels: (details?.labels ?? []).map((label) => label.trim()).filter(Boolean),
        year: Number(details?.year),
        type: details?.type ?? createEmptyRecordDetails().type,
        format: details?.format ?? createEmptyRecordDetails().format,
        image: imageKey,
        // Sides left without tracks (e.g. the default side B of a single-sided release) are dropped
        sides: (tracks?.sides ?? [])
            .filter((side) => side.songs.length > 0)
            .map((side) => ({
                name: side.name.trim(),
                songs: side.songs.map((song) => ({
                    title: song.title.trim(),
                    duration: parseTrackDuration(song.duration) ?? 0,
                })),
            })),
        tags: {
            genres: tags?.genres ?? [],
            colours: tags?.colours ?? [],
        },
    }
}

async function resolveImageKey(
    imageValues: ImageFormValues | undefined,
    uploadRecordImage: AddRecordCreateProps['uploadRecordImage'],
): Promise<string | undefined> {
    if (!imageValues || imageValues.hasImage !== HasImageOption.YES) {
        return undefined
    }

    if (imageValues.imageSource === ImageSourceOption.UPLOAD) {
        if (!imageValues.imageFile) {
            return undefined
        }

        if (!isSupportedImageContentType(imageValues.imageFile.type)) {
            throw new Error(`Unsupported image content type: ${imageValues.imageFile.type}`)
        }

        const { key } = await uploadRecordImage({
            source: 'file',
            contentType: imageValues.imageFile.type,
            data: await fileToBase64(imageValues.imageFile),
        })

        return key
    }

    if (!imageValues.imageUrl) {
        return undefined
    }

    const { key } = await uploadRecordImage({ source: 'url', url: imageValues.imageUrl })

    return key
}

export default function AddRecord(props: AddRecordProps) {
    const { record, searchExternalRecords, getExternalRecord } = props
    const { keyColors } = useColorMode()
    const router = useRouter()
    const [stepIndex, setStepIndex] = useState(0)
    const [formValues, setFormValues] = useState<AddRecordState>(() => mapRecordToFormState(record))
    const activeFormRef = useRef<{ submit: () => Promise<boolean> } | null>(null)
    const [blockNext, setBlockNext] = useState(false)

    // Editing keeps the existing artwork, so there's no image step
    const steps = useMemo<AddRecordStepKey[]>(
        () =>
            record
                ? ['catalogueNumber', 'details', 'tracks', 'tagging']
                : ['catalogueNumber', 'details', 'image', 'tracks', 'tagging'],
        [record],
    )

    const lastStepIndex = steps.length - 1

    const handleNext = (nextValues: Partial<AddRecordState>) => {
        setFormValues((currentValues) => ({ ...currentValues, ...nextValues }))
    }

    const handleWizardNext = async () => {
        const isValid = await activeFormRef.current?.submit()

        if (isValid === false) {
            return
        }

        if (stepIndex < lastStepIndex) {
            setStepIndex((currentStep) => Math.min(currentStep + 1, lastStepIndex))
        }
    }

    const handleWizardBack = () => {
        setStepIndex((currentStep) => Math.max(currentStep - 1, 0))
    }

    const handleTaggingSubmit = async (tags: RecordTags) => {
        const nextState = { ...formValues, tags }
        setFormValues(nextState)

        setBlockNext(true)

        try {
            if (props.editRecord) {
                await props.editRecord(
                    props.record.id,
                    buildPostRecordBody(nextState, props.record.image),
                )
                router.push(`/records/${props.record.id}`)
                return
            }

            const imageKey = await resolveImageKey(nextState.image, props.uploadRecordImage)
            const result = await props.addRecord(buildPostRecordBody(nextState, imageKey))
            router.push(`/records/${result.id}`)
        } finally {
            setBlockNext(false)
        }
    }

    const renderStep = () => {
        switch (steps[stepIndex]) {
            case 'catalogueNumber':
                return (
                    <CatalogueNumberForm
                        ref={activeFormRef}
                        initialValues={formValues.catalogueNumber}
                        initialSearch={formValues.externalSearch}
                        onSubmitStep={(values) => handleNext({ catalogueNumber: values })}
                        searchByCatalogueNumber={async (catNo) => {
                            const results = await searchExternalRecords(catNo)

                            handleNext({ externalSearch: { results } })

                            return results
                        }}
                        selectExternalRecord={async (musicBrainzId) => {
                            const result = await getExternalRecord(musicBrainzId)

                            setFormValues((currentValues) => ({
                                ...mapLookupToFormState(result, currentValues),
                                externalSearch: currentValues.externalSearch && {
                                    ...currentValues.externalSearch,
                                    selectedMusicBrainzId: musicBrainzId,
                                },
                            }))
                        }}
                        isLookupLoading={setBlockNext}
                    />
                )
            case 'details':
                return (
                    <RecordDetailsForm
                        ref={activeFormRef}
                        initialValues={formValues.details}
                        onSubmitStep={(values) => handleNext({ details: values })}
                    />
                )
            case 'image':
                return (
                    <ImageForm
                        ref={activeFormRef}
                        title={'Record Artwork'}
                        initialValues={formValues.image}
                        onSubmitStep={(values) => handleNext({ image: values })}
                    />
                )
            case 'tracks':
                return (
                    <TracksForm
                        ref={activeFormRef}
                        initialValues={formValues.tracks}
                        onSubmitStep={(values) => handleNext({ tracks: values })}
                    />
                )
            default:
                return (
                    <RecordTaggingForm
                        ref={activeFormRef}
                        initialValues={formValues.tags}
                        onSubmitStep={handleTaggingSubmit}
                    />
                )
        }
    }

    return (
        <VStack alignItems={'stretch'} gap={4} px={6} w={'full'}>
            <Text color={keyColors.primary} fontSize={'xl'} fontWeight={'bold'}>
                {record ? 'Edit' : 'Add'} Record ({stepIndex + 1} of {steps.length})
            </Text>
            {renderStep()}
            <HStack justifyContent={'space-between'} gap={4}>
                <Button
                    type={'button'}
                    colorStyle={'secondary'}
                    disabled={stepIndex === 0 || blockNext}
                    onClick={handleWizardBack}
                >
                    Back
                </Button>
                <Button
                    type={'button'}
                    colorStyle={'primary'}
                    onClick={handleWizardNext}
                    disabled={blockNext}
                >
                    {stepIndex === lastStepIndex ? 'Finish' : 'Next'}
                </Button>
            </HStack>
        </VStack>
    )
}
