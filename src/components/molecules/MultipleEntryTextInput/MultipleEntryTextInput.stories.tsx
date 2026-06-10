import { Flex, VStack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { useForm } from 'react-hook-form'
import MultipleEntryTextInput from './MultipleEntryTextInput'

type StoryValues = {
    tags: string[]
}

const submitSpy = fn()

function StoryWrapper() {
    const { control, handleSubmit, getValues, setValue } = useForm<StoryValues>({
        defaultValues: {
            tags: [''],
        },
        mode: 'onTouched',
    })

    return (
        <Flex p={4} maxW={'450px'}>
            <form
                noValidate
                style={{ width: '100%' }}
                onSubmit={(event) => {
                    event.preventDefault()
                    void handleSubmit((values) => submitSpy(values))()
                }}
            >
                <VStack w={'full'} alignItems={'stretch'} gap={4}>
                    <MultipleEntryTextInput
                        control={control}
                        getValues={getValues}
                        name={'tags'}
                        label={'Tag'}
                        itemName={'tag'}
                        setValue={setValue}
                        requiredMessage={'At least one tag is required'}
                    />
                </VStack>
            </form>
        </Flex>
    )
}

const meta: Meta<typeof MultipleEntryTextInput> = {
    title: 'Molecules/MultipleEntryTextInput',
    component: MultipleEntryTextInput,
    render: () => <StoryWrapper />,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CanAddAndRemoveEntries: Story = {
    play: async ({ canvas, userEvent }) => {
        submitSpy.mockClear()

        await userEvent.click(canvas.getByRole('button', { name: /add another tag/i }))

        await waitFor(() => {
            expect(canvas.getByLabelText(/tag 2/i, { selector: 'input' })).toBeInTheDocument()
        })

        await userEvent.type(canvas.getByLabelText(/tag 1/i, { selector: 'input' }), 'Dinner')
        await userEvent.type(canvas.getByLabelText(/tag 2/i, { selector: 'input' }), 'Quick')

        await userEvent.click(canvas.getAllByRole('button', { name: /delete tag/i })[1])

        await waitFor(() => {
            expect(canvas.queryByLabelText(/tag 2/i, { selector: 'input' })).not.toBeInTheDocument()
        })
    },
}
