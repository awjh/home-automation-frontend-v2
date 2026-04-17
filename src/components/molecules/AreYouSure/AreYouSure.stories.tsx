import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import AreYouSure from './AreYouSure'

const meta: Meta<typeof AreYouSure> = {
    title: 'Molecules/AreYouSure',
    component: AreYouSure,
    decorators: [(Story) => <Story />],
    args: {
        title: 'Do an action',
        message: 'Are you sure you wish to perform this action? This cannot be undone.',
        onCancel: fn(),
        onConfirm: fn(),
    },
}

export default meta
type Story = StoryObj<typeof AreYouSure>

export const Default: Story = {}

export const FiresConfirmAndCancelHandlers: Story = {
    play: async ({ canvas, args, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /cancel/i }))
        await userEvent.click(canvas.getByRole('button', { name: /confirm/i }))

        expect(args.onCancel).toHaveBeenCalledOnce()
        expect(args.onConfirm).toHaveBeenCalledOnce()
    },
}
