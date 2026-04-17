import { Stack } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import PasswordStrengthMeter from './PasswordStrengthMeter'

const meta: Meta<typeof PasswordStrengthMeter> = {
    title: 'Features/PasswordReset/PasswordStrengthMeter',
    component: PasswordStrengthMeter,
    decorators: [
        (Story) => (
            <Stack p={4} w={'400px'}>
                <Story />
            </Stack>
        ),
    ],
    args: {
        passwordValue: '',
    },
}

export default meta
type Story = StoryObj<typeof PasswordStrengthMeter>

export const PasswordNotSet: Story = {}

export const VeryWeakPassword: Story = {
    args: {
        passwordValue: '123',
    },
}

export const WeakPassword: Story = {
    args: {
        passwordValue: 'password123!',
    },
}

export const FairPassword: Story = {
    args: {
        passwordValue: 'p@ssword123!',
    },
}

export const GoodPassword: Story = {
    args: {
        passwordValue: 'Str0ngP@ssw0rd123!',
    },
}

export const StrongPassword: Story = {
    args: {
        passwordValue: 'Str0ng-P@ssw0rd123!',
    },
}
