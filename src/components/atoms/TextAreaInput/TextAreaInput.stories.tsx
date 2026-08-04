import { Flex } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, waitFor } from 'storybook/test'
import TextAreaInput from './TextAreaInput'

const meta: Meta<typeof TextAreaInput> = {
    title: 'Atoms/TextAreaInput',
    component: TextAreaInput,
    decorators: [
        (Story) => (
            <Flex p={4} maxW={'400px'}>
                <Story />
            </Flex>
        ),
    ],
    args: {
        label: 'Example label',
        required: false,
        onChange: fn(),
        onBlur: fn(),
    },
}

export default meta
type Story = StoryObj<typeof TextAreaInput>

export const Default: Story = {}

export const Required: Story = {
    args: {
        required: true,
    },
}

export const CallsOnChangeAndOnBlur: Story = {
    render: (args) => {
        const [value, setValue] = useState('')

        return (
            <>
                <TextAreaInput
                    {...args}
                    value={value}
                    onChange={(event) => {
                        setValue(event.target.value)
                        args.onChange?.(event)
                    }}
                />
                <button type="button">Outside target</button>
            </>
        )
    },
    play: async ({ canvas, args, userEvent }) => {
        const input = canvas.getByLabelText(/example label/i, { selector: 'textarea' })

        await userEvent.type(input, 'Hello world')

        await waitFor(() => {
            expect(input).toHaveValue('Hello world')
            expect(args.onChange).toHaveBeenCalled()
        })

        await userEvent.click(canvas.getByRole('button', { name: /outside target/i }))

        await waitFor(() => expect(args.onBlur).toHaveBeenCalled())
    },
}
