import type { Meta, StoryObj } from '@storybook/react-vite'
import MockRecord from '@test/mockData/records/MockRecord'
import { expect, fn, screen, waitFor, within } from 'storybook/test'
import RecordScreen from './RecordScreen'

const meta: Meta<typeof RecordScreen> = {
    title: 'Screens/RecordScreen',
    component: RecordScreen,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        record: { ...MockRecord, image: '/recipe.jpg' },
        uploadRecordImage: fn(async () => ({ key: 'new-image-key' })),
        updateRecordImage: fn(async () => '/recipe.jpg'),
    },
}

export default meta

type Story = StoryObj<typeof RecordScreen>

export const Default: Story = {}

export const ChangesRecordImageFromUrl: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getByRole('button', { name: /change record image/i }))

        const popup = within(canvas.getByTestId('edit-image-popup'))

        await userEvent.selectOptions(
            popup.getByLabelText(/how would you like to provide the image/i, {
                selector: 'select',
            }),
            'url',
        )
        await userEvent.type(
            popup.getByLabelText(/image url/i, { selector: 'input' }),
            'https://example.com/new.jpg',
        )
        await userEvent.click(popup.getByRole('button', { name: /save/i }))

        await waitFor(() => {
            expect(args.uploadRecordImage).toHaveBeenCalledWith({
                source: 'url',
                url: 'https://example.com/new.jpg',
            })
            expect(args.updateRecordImage).toHaveBeenCalledWith(args.record.id, 'new-image-key')
            expect(canvas.queryByTestId('edit-image-popup')).not.toBeInTheDocument()
            expect(screen.getByText(/updated image/i)).toBeInTheDocument()
        })
    },
}

export const RemovesRecordImage: Story = {
    play: async ({ canvas, userEvent, args }) => {
        await userEvent.click(canvas.getByRole('button', { name: /change record image/i }))

        const popup = within(canvas.getByTestId('edit-image-popup'))

        await userEvent.selectOptions(
            popup.getByLabelText(/would you like to remove the image/i, { selector: 'select' }),
            'yes',
        )
        await userEvent.click(popup.getByRole('button', { name: /remove/i }))

        await waitFor(() => {
            expect(args.uploadRecordImage).not.toHaveBeenCalled()
            expect(args.updateRecordImage).toHaveBeenCalledWith(args.record.id, undefined)
            expect(screen.getByText(/removed image/i)).toBeInTheDocument()
        })
    },
}
