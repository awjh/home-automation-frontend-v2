import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Button, Input, Text } from '@chakra-ui/react'
import { expect, fn, waitFor } from 'storybook/test'
import PopupForm from './PopupForm'

const meta: Meta<typeof PopupForm> = {
    title: 'Molecules/PopupForm',
    component: PopupForm,
    decorators: [
        (Story) => (
            <Box minH="100vh" position="relative" p={4}>
                <Story />
            </Box>
        ),
    ],
    args: {
        heading: 'Add recipe',
        dataProps: {
            cy: 'popup-form',
        },
        onClose: fn(),
    },
}

export default meta
type Story = StoryObj<typeof PopupForm>

export const Default: Story = {
    render: (args) => (
        <PopupForm {...args}>
            <Text>Use this popup to create or edit a recipe.</Text>
            <Input placeholder="Recipe name" />
            <Button type="submit">Save</Button>
        </PopupForm>
    ),
}

export const CallsOnCloseWhenBackdropClicked: Story = {
    render: Default.render,
    play: async ({ canvasElement, args, userEvent }) => {
        const form = canvasElement.querySelector('form')

        if (
            !(form instanceof HTMLElement) ||
            !(form.previousElementSibling instanceof HTMLElement)
        ) {
            throw new Error('PopupForm backdrop could not be found.')
        }

        await userEvent.click(form.previousElementSibling)

        await waitFor(() => {
            expect(args.onClose).toHaveBeenCalledOnce()
        })
    },
}
