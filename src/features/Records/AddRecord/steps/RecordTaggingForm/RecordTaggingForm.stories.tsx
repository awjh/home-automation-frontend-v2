import { Colour, Genre } from '@awjh/home-automation-v2-api-models/records'
import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import RecordTaggingForm from './RecordTaggingForm'

const meta: Meta<typeof RecordTaggingForm> = {
    title: 'Features/Records/AddRecord/steps/RecordTaggingForm',
    component: RecordTaggingForm,
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
type Story = StoryObj<typeof RecordTaggingForm>

export const Default: Story = {}

export const WithSelectedTags: Story = {
    args: {
        initialValues: { genres: [Genre.ROCK], colours: [Colour.BLACK] },
    },
}
