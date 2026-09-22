import { RecipeTags } from '@awjh/home-automation-v2-api-models/recipes'
import TagSelector, { createTagSelection } from '@molecules/TagSelector/TagSelector'
import { Fieldset, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { forwardRef, useImperativeHandle, useState, type FormEvent } from 'react'

interface TaggingFormProps {
    initialValues?: RecipeTags
    tags: RecipeTags
    onSubmitStep: (tags: RecipeTags) => void
}

const TaggingForm = forwardRef<{ submit: () => Promise<boolean> }, TaggingFormProps>(
    function TaggingForm(props, ref) {
        const { keyColors } = useColorMode()
        const [selectedTags, setSelectedTags] = useState<RecipeTags>(() =>
            createTagSelection(props.tags, props.initialValues),
        )

        useImperativeHandle(ref, () => ({
            submit: async () => {
                props.onSubmitStep({
                    ...selectedTags,
                })
                return true
            },
        }))

        const submitHandler = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()

            props.onSubmitStep({
                ...selectedTags,
            })
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
                            Add Recipe Tags
                        </Fieldset.Legend>
                        <Fieldset.Content>
                            <TagSelector
                                tagOptions={props.tags}
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

export default TaggingForm
