import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, waitFor } from 'storybook/test'
import SelectInput from './SelectInput'
import { Flex } from '@chakra-ui/react'

const meta: Meta<typeof SelectInput> = {
    title: 'Atoms/SelectInput',
    component: SelectInput,
    decorators: [
        (Story) => (
            <Flex p={4} maxW={'400px'}>
                <Story />
            </Flex>
        ),
    ],
    args: {
        options: [
            {
                value: 'option1',
                label: 'Option 1',
            },
            {
                value: 'option2',
                label: 'Option 2',
            },
        ],
        label: 'Example label',
        required: false,
        onChange: fn(),
        onBlur: fn(),
    },
}

export default meta
type Story = StoryObj<typeof SelectInput>

export const Default: Story = {}

export const Required: Story = {
    args: {
        required: true,
    },
}

export const CallsOnChangeAndOnBlur: Story = {
    play: async ({ canvas, args, userEvent }) => {
        const selectInput = canvas.getByLabelText(/example label/i, { selector: 'select' })

        await userEvent.selectOptions(selectInput, 'option2')

        await waitFor(() => expect(args.onChange).toHaveBeenCalledWith('option2'))

        fireEvent.blur(selectInput)

        await waitFor(() => expect(args.onBlur).toHaveBeenCalled())
    },
}
