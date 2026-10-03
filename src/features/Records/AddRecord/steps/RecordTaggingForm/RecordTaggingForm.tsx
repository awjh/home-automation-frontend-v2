import { Colour, Genre, RecordTags } from '@awjh/home-automation-v2-api-models/records'
import { Fieldset, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import TagSelector, { createTagSelection } from '@molecules/TagSelector/TagSelector'
import { forwardRef, useImperativeHandle, useState, type FormEvent } from 'react'

const recordTagOptions: RecordTags = {
    genres: Object.values(Genre),
    colours: Object.values(Colour),
}

interface RecordTaggingFormProps {
    initialValues?: RecordTags
    onSubmitStep: (tags: RecordTags) => void
}

const RecordTaggingForm = forwardRef<{ submit: () => Promise<boolean> }, RecordTaggingFormProps>(
    function RecordTaggingForm(props, ref) {
        const { keyColors } = useColorMode()
        const [selectedTags, setSelectedTags] = useState<RecordTags>(() =>
            createTagSelection(recordTagOptions, props.initialValues),
        )

        useImperativeHandle(ref, () => ({
            submit: async () => {
                props.onSubmitStep(selectedTags)
                return true
            },
        }))

        const submitHandler = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            props.onSubmitStep(selectedTags)
        }

        return (
            <form noValidate onSubmit={submitHandler}>
                <Fieldset.Root size={'lg'} maxW={'full'}>
                    <VStack alignItems={'stretch'} gap={4}>
                        <Fieldset.Legend
                            color={keyColors.primary}
                            fontSize={'2xl'}
                            fontWeight={'bold'}
                            alignSelf={'start'}
                        >
                            Add Record Tags
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <TagSelector
                                tagOptions={recordTagOptions}
                                selectedTags={selectedTags}
                                onSelectedTagsChange={setSelectedTags}
                            />
                        </Fieldset.Content>
                    </VStack>
                </Fieldset.Root>
            </form>
        )
    },
)

export default RecordTaggingForm
