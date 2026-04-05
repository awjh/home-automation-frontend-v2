import type { Meta, StoryObj } from '@storybook/react-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, fn, screen, type Mock, waitFor } from 'storybook/test'
import Login from './Login'
import fillValidCredentials, {
    ValidEmail,
    ValidPassword,
} from '@test/storybookHelpers/loginForm/fillValidCredentials'

const meta: Meta<typeof Login> = {
    title: 'Templates/Login',
    component: Login,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    decorators: [(Story) => <Story />],
    args: {
        onSubmit: fn().mockResolvedValue(undefined),
    },
}

export default meta
type Story = StoryObj<typeof Login>

export const Default: Story = {}

export const SuccessfulLogin: Story = {
    play: async ({ args, canvas, userEvent }) => {
        ;(args.onSubmit as unknown as Mock).mockResolvedValue(undefined)
        const router = getRouter()

        const submitButton = await fillValidCredentials(canvas, userEvent)
        await userEvent.click(submitButton)

        await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith(ValidEmail, ValidPassword))
        await waitFor(() => expect(router.push).toHaveBeenCalledWith('/'))
    },
}

export const FailedLoginShowsToast: Story = {
    play: async ({ args, canvas, userEvent }) => {
        ;(args.onSubmit as unknown as Mock).mockRejectedValue(new Error('Invalid credentials'))

        const submitButton = await fillValidCredentials(canvas, userEvent)
        await userEvent.click(submitButton)

        await waitFor(() => expect(args.onSubmit).toHaveBeenCalledWith(ValidEmail, ValidPassword))

        const [toast] = await screen.findAllByText(
            /please check your email and password and try again/i,
        )
        expect(toast).toBeInTheDocument()
    },
}
