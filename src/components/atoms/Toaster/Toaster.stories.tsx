import type { Meta, StoryObj } from '@storybook/react-vite'
import Toaster from './Toaster'
import { Button, Flex } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { expect, screen } from 'storybook/test'

function ToasterDemo() {
    const toaster = useToaster()
    return (
        <Flex p={4} gap={2} flexWrap="wrap">
            <Button
                onClick={() =>
                    toaster.create({
                        title: 'Success',
                        description: 'Everything worked!',
                        type: 'success',
                    })
                }
            >
                Success
            </Button>
            <Button
                onClick={() =>
                    toaster.create({
                        title: 'Error',
                        description: 'Something went wrong.',
                        type: 'error',
                    })
                }
            >
                Error
            </Button>
            <Button
                onClick={() => {
                    const toast = toaster.create({
                        title: 'Loading',
                        description: 'Please wait...',
                        type: 'loading',
                    })

                    setTimeout(() => {
                        toaster.dismiss(toast)
                    }, 30000)
                }}
            >
                Loading
            </Button>
            <Button
                onClick={() =>
                    toaster.create({
                        title: 'Info',
                        description: 'Just so you know.',
                        type: 'info',
                        duration: 10000,
                    })
                }
            >
                Info
            </Button>
        </Flex>
    )
}

const meta: Meta<typeof ToasterDemo> = {
    title: 'Atoms/Toaster',
    component: ToasterDemo,
    args: {},
}

export default meta
type Story = StoryObj<typeof ToasterDemo>

export const Success: Story = {
    play: async ({ canvas }) => {
        const button = canvas.getByRole('button', { name: /success/i })
        await button.click()

        const [toast] = await screen.findAllByText(/everything worked!/i)
        expect(toast).toBeInTheDocument()
    },
}

export const Error: Story = {
    play: async ({ canvas }) => {
        const button = canvas.getByRole('button', { name: /error/i })
        await button.click()

        const [toast] = await screen.findAllByText(/something went wrong/i)
        expect(toast).toBeInTheDocument()
    },
}

export const Loading: Story = {
    play: async ({ canvas }) => {
        const button = canvas.getByRole('button', { name: /loading/i })
        await button.click()

        const [toast] = await screen.findAllByText(/please wait/i)
        expect(toast).toBeInTheDocument()
    },
}

export const Info: Story = {
    play: async ({ canvas }) => {
        const button = canvas.getByRole('button', { name: /info/i })
        await button.click()

        const [toast] = await screen.findAllByText(/just so you know/i)
        expect(toast).toBeInTheDocument()
    },
}
