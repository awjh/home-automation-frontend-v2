import type { Meta, StoryObj } from '@storybook/react'
import PasswordInput from './PasswordInput'
import { Flex } from '@chakra-ui/react'
import { useState } from 'react'

const meta: Meta<typeof PasswordInput> = {
    title: 'Atoms/PasswordInput',
    component: PasswordInput,
    decorators: [
        (Story) => (
            <Flex p={4} maxW={'400px'}>
                <Story />
            </Flex>
        ),
    ],
    args: {
        label: 'Example label',
    },
}

export default meta
type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {
    render: (args) => {
        const [value, setValue] = useState('')
        return <PasswordInput {...args} value={value} onChange={setValue} />
    },
}

export const WithValue: Story = {
    render: (args) => {
        const [value, setValue] = useState('supersecret123')
        return <PasswordInput {...args} value={value} onChange={setValue} />
    },
}

export const WithError: Story = {
    render: (args) => {
        const [value, setValue] = useState('weak')
        return (
            <PasswordInput
                {...args}
                value={value}
                onChange={setValue}
                errorMessage="Password does not meet requirements"
            />
        )
    },
}
