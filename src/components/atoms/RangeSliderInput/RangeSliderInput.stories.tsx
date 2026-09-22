import { Flex } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import RangeSliderInput, { type RangeSliderValue } from './RangeSliderInput'

const meta: Meta<typeof RangeSliderInput> = {
    title: 'Atoms/RangeSliderInput',
    component: RangeSliderInput,
    decorators: [
        (Story) => (
            <Flex p={4} w={'full'}>
                <Story />
            </Flex>
        ),
    ],
    args: {
        label: 'Calories',
        min: 0,
        max: 5000,
        step: 50,
        value: {
            min: 1000,
            max: 2500,
        } satisfies RangeSliderValue,
    },
}

export default meta
type Story = StoryObj<typeof RangeSliderInput>

export const Default: Story = {
    render: (args) => {
        const [value, setValue] = useState<RangeSliderValue>(args.value)

        return <RangeSliderInput {...args} value={value} onChange={setValue} />
    },
}

export const Required: Story = {
    args: {
        required: true,
    },
    render: (args) => {
        const [value, setValue] = useState<RangeSliderValue>(args.value)

        return <RangeSliderInput {...args} value={value} onChange={setValue} />
    },
}
