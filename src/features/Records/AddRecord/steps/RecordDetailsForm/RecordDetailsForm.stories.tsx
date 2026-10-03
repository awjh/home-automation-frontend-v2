import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, waitFor } from 'storybook/test'
import RecordDetailsForm from './RecordDetailsForm'

const meta: Meta<typeof RecordDetailsForm> = {
    title: 'Features/Records/AddRecord/steps/RecordDetailsForm',
    component: RecordDetailsForm,
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
type Story = StoryObj<typeof RecordDetailsForm>

export const Default: Story = {}

export const ShowsValidationErrors: Story = {
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        await userEvent.type(canvas.getByLabelText(/^year/i, { selector: 'input' }), '77')
        fireEvent.submit(canvasElement.querySelector('form') as HTMLFormElement)

        await waitFor(() => {
            expect(canvas.getByText('Title is required')).toBeInTheDocument()
            expect(canvas.getByText('At least one artist is required')).toBeInTheDocument()
            expect(canvas.getByText('At least one label is required')).toBeInTheDocument()
            expect(canvas.getByText('Year must be four digits')).toBeInTheDocument()
        })
        expect(args.onSubmitStep).not.toHaveBeenCalled()
    },
}
