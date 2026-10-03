import { Box, Grid, GridItem, IconButton, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import AreYouSure from '@molecules/AreYouSure/AreYouSure'
import parseTrackDuration from '@utils/parseTrackDuration'
import { Fragment, useState } from 'react'
import {
    useFieldArray,
    type Control,
    type UseFormClearErrors,
    type UseFormSetValue,
} from 'react-hook-form'
import { LuTrash } from 'react-icons/lu'
import SideTitle from '../SideTitle/SideTitle'
import TrackField from '../TrackField/TrackField'

export type TracksFormTrackRow = {
    title: string
    // Entered as mm:ss
    duration: string
}

export type TracksFormSide = {
    name: string
    songs: TracksFormTrackRow[]
}

export type TracksFormValues = {
    sides: TracksFormSide[]
}

export type TrackFieldPath = `sides.${number}.songs.${number}.${keyof TracksFormTrackRow}`

export function createEmptyTrack(): TracksFormTrackRow {
    return { title: '', duration: '' }
}

// Sides are lettered A, B, C... in order
export function createEmptySide(sideIndex: number): TracksFormSide {
    return {
        name: String.fromCharCode(65 + sideIndex),
        songs: [],
    }
}

export function isTrackRowEmpty(row?: TracksFormTrackRow) {
    if (!row) {
        return true
    }

    return Object.values(row).every((value) => value.trim() === '')
}

export function validateTrackDuration(value: string | undefined) {
    if (!value?.trim()) {
        return 'duration is required'
    }

    return parseTrackDuration(value) !== undefined || 'duration must be mm:ss'
}

interface SideFormProps {
    control: Control<TracksFormValues>
    clearErrors: UseFormClearErrors<TracksFormValues>
    sideIndex: number
    sideCount: number
    onDeleteSide: () => void
    setValue: UseFormSetValue<TracksFormValues>
    onDraftTrackChange: (draftTrack: TracksFormTrackRow) => void
}

export default function SideForm({
    control,
    clearErrors,
    sideIndex,
    sideCount,
    onDeleteSide,
    setValue,
    onDraftTrackChange,
}: SideFormProps) {
    const { keyColors } = useColorMode()
    const [isDeleteSideConfirmationOpen, setIsDeleteSideConfirmationOpen] = useState(false)
    const [draftTrack, setDraftTrack] = useState(createEmptyTrack())
    const [draftErrors, setDraftErrors] = useState<
        Partial<Record<keyof TracksFormTrackRow, string>>
    >({})
    const songsPath = `sides.${sideIndex}.songs` as const
    const { append, fields, remove } = useFieldArray({
        control,
        name: songsPath,
    })

    const updateDraftTrack = (fieldName: keyof TracksFormTrackRow, value: string) => {
        setDraftTrack((currentDraft) => {
            const nextDraft = { ...currentDraft, [fieldName]: value }

            onDraftTrackChange(nextDraft)

            return nextDraft
        })
        setDraftErrors((currentErrors) => ({ ...currentErrors, [fieldName]: undefined }))
    }

    const handleDraftRowEnter = () => {
        if (isTrackRowEmpty(draftTrack)) {
            setDraftErrors({})
            return
        }

        const nextErrors: Partial<Record<keyof TracksFormTrackRow, string>> = {}

        if (!draftTrack.title.trim()) {
            nextErrors.title = 'title is required'
        }

        const durationValidation = validateTrackDuration(draftTrack.duration)

        if (durationValidation !== true) {
            nextErrors.duration = durationValidation
        }

        setDraftErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        append(draftTrack)
        setDraftTrack(createEmptyTrack())
        onDraftTrackChange(createEmptyTrack())
        setDraftErrors({})
    }

    return (
        <VStack gap={4} alignItems={'stretch'} p={2}>
            <SideTitle
                control={control}
                sideIndex={sideIndex}
                setValue={setValue}
                canDeleteSide={sideCount > 1}
                onDeleteSide={() => {
                    setIsDeleteSideConfirmationOpen(true)
                }}
            />
            <Grid gap={4} templateColumns={'2rem 6fr 2fr auto'} alignItems={'start'}>
                <GridItem />
                <GridItem>
                    <Text color={keyColors.primary}>Title</Text>
                </GridItem>
                <GridItem colSpan={2}>
                    <Text color={keyColors.primary}>Duration (mm:ss)</Text>
                </GridItem>
                {fields.map((field, rowIndex) => (
                    <Fragment key={field.id}>
                        <GridItem pt={2}>
                            <Text color={keyColors.primary}>{rowIndex + 1}.</Text>
                        </GridItem>
                        <TrackField
                            control={control}
                            fieldPath={`${songsPath}.${rowIndex}.title`}
                            fieldName={'title'}
                            isDraftRow={false}
                            onDraftRowEnter={() => {}}
                        />
                        <TrackField
                            control={control}
                            fieldPath={`${songsPath}.${rowIndex}.duration`}
                            fieldName={'duration'}
                            isDraftRow={false}
                            onDraftRowEnter={() => {}}
                        />
                        <GridItem>
                            <IconButton
                                type={'button'}
                                aria-label={'delete track'}
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
                                    remove(rowIndex)
                                    clearErrors(songsPath)
                                }}
                                data-testid={`delete-track-button-${sideIndex}-${rowIndex}`}
                            >
                                <LuTrash />
                            </IconButton>
                        </GridItem>
                    </Fragment>
                ))}
                <GridItem pt={2}>
                    <Text color={keyColors.primary}>{fields.length + 1}.</Text>
                </GridItem>
                <TrackField
                    fieldName={'title'}
                    isDraftRow={true}
                    onDraftRowEnter={handleDraftRowEnter}
                    value={draftTrack.title}
                    errorMessage={draftErrors.title}
                    onValueChange={(value) => updateDraftTrack('title', value)}
                />
                <TrackField
                    fieldName={'duration'}
                    isDraftRow={true}
                    colSpan={2}
                    onDraftRowEnter={handleDraftRowEnter}
                    value={draftTrack.duration}
                    errorMessage={draftErrors.duration}
                    onValueChange={(value) => updateDraftTrack('duration', value)}
                />
            </Grid>
            {isDeleteSideConfirmationOpen ? (
                <Box
                    position={'absolute'}
                    w={'100vw'}
                    h={'100vh'}
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                >
                    <AreYouSure
                        title={'Delete Side?'}
                        message={
                            'Are you sure you want to delete this side? This will also delete all tracks on the side.'
                        }
                        onCancel={() => {
                            setIsDeleteSideConfirmationOpen(false)
                        }}
                        onConfirm={() => {
                            setIsDeleteSideConfirmationOpen(false)
                            onDeleteSide()
                        }}
                    />
                </Box>
            ) : null}
        </VStack>
    )
}
