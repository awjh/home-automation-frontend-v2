import Button from '@atoms/Button/Button'
import { Fieldset, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import SideForm, {
    createEmptySide,
    isTrackRowEmpty,
    type TracksFormTrackRow,
    type TracksFormValues,
} from './SideForm/SideForm'

interface TracksFormProps {
    initialValues?: TracksFormValues
    onSubmitStep: (values: TracksFormValues) => void
}

const DRAFT_TRACK_MESSAGE =
    'Please clear the draft track or press Enter to add it before continuing.'

const TracksForm = forwardRef<{ submit: () => Promise<boolean> }, TracksFormProps>(
    function TracksForm(props, ref) {
        const { keyColors } = useColorMode()
        // Indexed by side, a missing entry means that side's draft row is empty
        const [draftTracksBySide, setDraftTracksBySide] = useState<TracksFormTrackRow[]>([])
        const { control, clearErrors, handleSubmit, reset, setValue } = useForm<TracksFormValues>({
            defaultValues: {
                sides: [createEmptySide(0), createEmptySide(1)],
            },
            mode: 'onTouched',
        })

        const hasUnsubmittedDraft = () =>
            draftTracksBySide.some((draftTrack) => !isTrackRowEmpty(draftTrack))

        useImperativeHandle(ref, () => ({
            submit: () =>
                new Promise<boolean>((resolve) => {
                    handleSubmit(
                        (input) => {
                            if (hasUnsubmittedDraft()) {
                                window.alert(DRAFT_TRACK_MESSAGE)
                                resolve(false)
                                return
                            }

                            props.onSubmitStep(input)
                            resolve(true)
                        },
                        () => resolve(false),
                    )()
                }),
        }))

        useEffect(() => {
            reset({
                sides: props.initialValues?.sides?.length
                    ? props.initialValues.sides
                    : [createEmptySide(0), createEmptySide(1)],
            })
        }, [props.initialValues, reset])

        const {
            fields: sides,
            append: appendSide,
            remove: removeSide,
        } = useFieldArray({
            control,
            name: 'sides',
        })

        return (
            <form
                noValidate
                onSubmit={handleSubmit((input) => {
                    if (hasUnsubmittedDraft()) {
                        window.alert(DRAFT_TRACK_MESSAGE)
                        return
                    }

                    props.onSubmitStep(input)
                })}
            >
                <Fieldset.Root size={'lg'} maxW={'2xl'}>
                    <VStack gap={4}>
                        <Fieldset.Legend
                            color={keyColors.primary}
                            fontSize={'2xl'}
                            fontWeight={'bold'}
                            alignSelf={'start'}
                        >
                            Add Tracks
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <VStack gap={6} alignItems={'stretch'}>
                                {sides.map((side, sideIndex) => (
                                    <SideForm
                                        key={side.id}
                                        control={control}
                                        clearErrors={clearErrors}
                                        sideIndex={sideIndex}
                                        sideCount={sides.length}
                                        setValue={setValue}
                                        onDeleteSide={() => {
                                            removeSide(sideIndex)
                                            setDraftTracksBySide((currentDraftTracks) => [
                                                ...currentDraftTracks.slice(0, sideIndex),
                                                ...currentDraftTracks.slice(sideIndex + 1),
                                            ])
                                        }}
                                        onDraftTrackChange={(draftTrack) => {
                                            setDraftTracksBySide((currentDraftTracks) => {
                                                const nextDraftTracks = [...currentDraftTracks]
                                                nextDraftTracks[sideIndex] = draftTrack

                                                return nextDraftTracks
                                            })
                                        }}
                                    />
                                ))}
                                <Button
                                    type={'button'}
                                    colorStyle={'secondary'}
                                    onClick={() => {
                                        appendSide(createEmptySide(sides.length))
                                    }}
                                >
                                    Add Side
                                </Button>
                            </VStack>
                        </Fieldset.Content>
                    </VStack>
                </Fieldset.Root>
            </form>
        )
    },
)

export default TracksForm
