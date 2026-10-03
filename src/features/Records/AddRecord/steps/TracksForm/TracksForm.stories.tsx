import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, waitFor } from 'storybook/test'
import TracksForm from './TracksForm'

const meta: Meta<typeof TracksForm> = {
    title: 'Features/Records/AddRecord/steps/TracksForm',
    component: TracksForm,
    decorators: [
        (Story) => (
            <Box p={4}>
                <Story />
            </Box>
        ),
    ],
    args: {
        onSubmitStep: fn(),
    },
}

export default meta
type Story = StoryObj<typeof TracksForm>

export const Default: Story = {}

export const WithTracks: Story = {
    args: {
        initialValues: {
            sides: [
                {
                    name: 'A',
                    songs: [
                        { title: 'Second Hand News', duration: '02:43' },
                        { title: 'Dreams', duration: '04:14' },
                    ],
                },
                { name: 'B', songs: [{ title: 'The Chain', duration: '04:30' }] },
            ],
        },
    },
}

export const CanDeleteTrack: Story = {
    args: {
        initialValues: {
            sides: [
                {
                    name: 'A',
                    songs: [
                        { title: 'Second Hand News', duration: '02:43' },
                        { title: 'Dreams', duration: '04:14' },
                        { title: 'Never Going Back Again', duration: '02:14' },
                    ],
                },
                { name: 'B', songs: [{ title: 'The Chain', duration: '04:30' }] },
            ],
        },
    },
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        await userEvent.click(canvas.getByTestId('delete-track-button-0-1'))

        await waitFor(() => {
            expect(canvas.queryByDisplayValue('Dreams')).not.toBeInTheDocument()
        })

        // The tracks after the deleted one are renumbered, leaving 1, 2 and the draft row's 3
        // on side A, then 1 and the draft row's 2 on side B
        expect(
            canvas.getAllByText(/^\d+\.$/).map((trackNumber) => trackNumber.textContent),
        ).toEqual(['1.', '2.', '3.', '1.', '2.'])

        fireEvent.submit(canvasElement.querySelector('form') as HTMLFormElement)

        await waitFor(() => {
            expect(args.onSubmitStep).toHaveBeenCalledWith({
                sides: [
                    {
                        name: 'A',
                        songs: [
                            { title: 'Second Hand News', duration: '02:43' },
                            { title: 'Never Going Back Again', duration: '02:14' },
                        ],
                    },
                    { name: 'B', songs: [{ title: 'The Chain', duration: '04:30' }] },
                ],
            })
        })
    },
}

export const AddsTrackOnEnter: Story = {
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        const [title] = canvas.getAllByLabelText(/^new track title/i, { selector: 'input' })
        const [duration] = canvas.getAllByLabelText(/^new track duration/i, {
            selector: 'input',
        })

        await userEvent.type(title, 'Dreams')
        await userEvent.type(duration, '4:14{Enter}')

        await waitFor(() => {
            expect(canvas.getByDisplayValue('Dreams')).toBeInTheDocument()
            expect(title).toHaveValue('')
        })

        fireEvent.submit(canvasElement.querySelector('form') as HTMLFormElement)

        await waitFor(() => {
            expect(args.onSubmitStep).toHaveBeenCalledWith({
                sides: [
                    { name: 'A', songs: [{ title: 'Dreams', duration: '4:14' }] },
                    { name: 'B', songs: [] },
                ],
            })
        })
    },
}

export const RejectsInvalidDuration: Story = {
    play: async ({ canvas, userEvent }) => {
        const [title] = canvas.getAllByLabelText(/^new track title/i, { selector: 'input' })
        const [duration] = canvas.getAllByLabelText(/^new track duration/i, {
            selector: 'input',
        })

        await userEvent.type(title, 'Dreams')
        await userEvent.type(duration, '4.14{Enter}')

        await waitFor(() => {
            expect(canvas.getByText('duration must be mm:ss')).toBeInTheDocument()
        })
        expect(canvas.queryByDisplayValue('Dreams')).toHaveAttribute(
            'aria-label',
            'new track title',
        )
    },
}

export const CanAddAndDeleteSides: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: /add side/i }))

        await waitFor(() => {
            expect(canvas.getByText('Side C')).toBeInTheDocument()
        })

        const deleteButtons = canvas.getAllByRole('button', { name: /delete side/i })
        await userEvent.click(deleteButtons[2])
        await userEvent.click(canvas.getByRole('button', { name: /confirm/i }))

        await waitFor(() => {
            expect(canvas.queryByText('Side C')).not.toBeInTheDocument()
        })
    },
}

export const CanRenameSide: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByText('Side A'))

        const sideName = canvas.getByLabelText(/side name/i, { selector: 'input' })
        await userEvent.clear(sideName)
        await userEvent.type(sideName, 'AA{Enter}')

        await waitFor(() => {
            expect(canvas.getByText('Side AA')).toBeInTheDocument()
        })
    },
}

export const BlocksUnsubmittedDraftTrack: Story = {
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        const alert = fn()
        window.alert = alert

        const [title] = canvas.getAllByLabelText(/^new track title/i, { selector: 'input' })
        await userEvent.type(title, 'Unsaved')

        fireEvent.submit(canvasElement.querySelector('form') as HTMLFormElement)

        await waitFor(() => {
            expect(alert).toHaveBeenCalled()
        })
        expect(args.onSubmitStep).not.toHaveBeenCalled()
    },
}
