import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, type Mock, waitFor } from 'storybook/test'
import fillValidCredentials, {
    ValidEmail,
    ValidPassword,
} from '@test/storybookHelpers/loginForm/fillValidCredentials'
import Login from './Login'

const meta: Meta<typeof Login> = {
    title: 'Features/Login',
    component: Login,
    decorators: [(Story) => <Story />],
    args: {
        onSubmit: fn().mockResolvedValue(undefined),
    },
}

export default meta

type Story = StoryObj<typeof Login>

export const Default: Story = {}

export const RequiresEmailAndPassword: Story = {
    play: async ({ canvas, args, userEvent }) => {
        const button = canvas.getByRole('button', { name: /log in/i })
        expect(button).toBeInTheDocument()

        await userEvent.click(button)

        await waitFor(() => {
            expect(canvas.getByText(/email is required/i)).toBeInTheDocument()
            expect(canvas.getByText(/password is required/i)).toBeInTheDocument()
        })
        expect(args.onSubmit).not.toHaveBeenCalled()
    },
}

export const InvalidEmailShowsError: Story = {
    play: async ({ canvas, args, userEvent }) => {
        const emailInput = canvas.getByLabelText(/email/i, { selector: 'input' })
        const passwordInput = canvas.getByLabelText(/password/i, { selector: 'input' })

        await userEvent.type(emailInput, 'not-an-email')
        await userEvent.type(passwordInput, 'Password123!')
        await userEvent.click(canvas.getByRole('button', { name: /log in/i }))

        await waitFor(() =>
            expect(canvas.getByText(/please enter a valid email address/i)).toBeInTheDocument(),
        )
        expect(args.onSubmit).not.toHaveBeenCalled()
    },
}

export const SubmitsAndShowsLoadingState: Story = {
    play: async ({ args, canvas, userEvent }) => {
        ;(args.onSubmit as unknown as Mock).mockImplementation(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500))
            return undefined
        })

        const submitButton = await fillValidCredentials(canvas, userEvent)
        await userEvent.click(submitButton)

        await waitFor(() =>
            expect(canvas.getByRole('button', { name: /logging in/i })).toBeDisabled(),
        )

        await waitFor(() => expect(canvas.getByRole('button', { name: /log in/i })).toBeEnabled())

        await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith(ValidEmail, ValidPassword))
    },
}

export const StopsLoadingOnError: Story = {
    play: async ({ canvas, args, userEvent }) => {
        ;(args.onSubmit as unknown as Mock).mockImplementation(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500))
            throw new Error('Invalid credentials')
        })

        const submitButton = await fillValidCredentials(canvas, userEvent)
        await userEvent.click(submitButton)

        await waitFor(() =>
            expect(canvas.getByRole('button', { name: /logging in/i })).toBeDisabled(),
        )

        await waitFor(() => expect(canvas.getByRole('button', { name: /log in/i })).toBeEnabled())
    },
}
