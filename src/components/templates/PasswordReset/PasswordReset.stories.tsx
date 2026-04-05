import type { Meta, StoryObj } from '@storybook/react-vite'
import { getRouter } from '@storybook/nextjs-vite/router.mock'
import { expect, fn, screen, type Mock, waitFor } from 'storybook/test'
import PasswordReset from './PasswordReset'

const ValidPassword = 'CorrectHorseBatteryStaple123!'

const meta: Meta<typeof PasswordReset> = {
    title: 'Templates/PasswordReset',
    component: PasswordReset,
    decorators: [(Story) => <Story />],
    args: {
        isValidLink: true,
        onSubmit: fn().mockResolvedValue(undefined),
        redirectOnSuccess: '/login',
    },
}

export default meta
type Story = StoryObj<typeof PasswordReset>

export const Default: Story = {}

export const InvalidLink: Story = {
    args: {
        isValidLink: false,
    },
}

export const SuccessfulPasswordReset: Story = {
    play: async ({ args, canvas, userEvent }) => {
        ;(args.onSubmit as unknown as Mock).mockResolvedValue(undefined)
        const router = getRouter()

        const newPasswordInput = canvas.getByLabelText(/new password/i, { selector: 'input' })
        const confirmPasswordInput = canvas.getByLabelText(/confirm password/i, {
            selector: 'input',
        })
        const submitButton = canvas.getByRole('button', { name: /reset password/i })

        await userEvent.clear(newPasswordInput)
        await userEvent.type(newPasswordInput, ValidPassword)
        await userEvent.clear(confirmPasswordInput)
        await userEvent.type(confirmPasswordInput, ValidPassword)
        await userEvent.click(submitButton)

        await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith(ValidPassword))

        const [toast] = await screen.findAllByText(/password reset successful/i)
        expect(toast).toBeInTheDocument()

        await waitFor(() => expect(router.push).toHaveBeenCalledWith(args.redirectOnSuccess), {
            timeout: 6000,
        })
    },
}

export const FailedPasswordResetShowsToast: Story = {
    play: async ({ args, canvas, userEvent }) => {
        ;(args.onSubmit as unknown as Mock).mockRejectedValue(new Error('Invalid token'))

        const newPasswordInput = canvas.getByLabelText(/new password/i, { selector: 'input' })
        const confirmPasswordInput = canvas.getByLabelText(/confirm password/i, {
            selector: 'input',
        })
        const submitButton = canvas.getByRole('button', { name: /reset password/i })

        await userEvent.clear(newPasswordInput)
        await userEvent.type(newPasswordInput, ValidPassword)
        await userEvent.clear(confirmPasswordInput)
        await userEvent.type(confirmPasswordInput, ValidPassword)
        await userEvent.click(submitButton)

        await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith(ValidPassword))

        const [toast] = await screen.findAllByText(/please request a new password reset link/i)
        expect(toast).toBeInTheDocument()
    },
}
