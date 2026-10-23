import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@chakra-ui/react'
import { expect, fn, waitFor } from 'storybook/test'
import BellboardRoom from './BellboardRoom'

const meta: Meta<typeof BellboardRoom> = {
    title: 'Features/Bellboards/BellboardRoom',
    component: BellboardRoom,
    decorators: [
        (Story) => (
            <Box p={4} w={'160px'}>
                <Story />
            </Box>
        ),
    ],
    args: {
        room: 'Library',
        onRing: fn(async () => ({ eventId: '0b6f5f5e-8a8f-4c1e-9f3b-2a1d6e7c8b9a' })),
    },
}

export default meta
type Story = StoryObj<typeof BellboardRoom>

function getInnerCircle(canvasElement: HTMLElement) {
    return canvasElement.querySelector('[data-part="inner-circle"]') as HTMLElement
}

export const Default: Story = {
    play: async ({ canvas, canvasElement }) => {
        const room = canvas.getByRole('button', { name: 'Ring Library' })
        const outerCircle = canvasElement.querySelector('[data-part="outer-circle"]') as HTMLElement
        const innerCircle = getInnerCircle(canvasElement)

        expect(room).toBeEnabled()
        expect(room).toHaveTextContent('Library')
        expect(outerCircle).toContainElement(innerCircle)
        expect(getComputedStyle(outerCircle).padding).toBe('5px')
        expect(innerCircle).not.toHaveAttribute('data-filled')
        expect(getComputedStyle(innerCircle).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    },
}

export const RoomNameAtBottom: Story = {
    play: async ({ canvas, canvasElement }) => {
        const outerCircle = canvasElement.querySelector('[data-part="outer-circle"]') as HTMLElement
        const roomName = canvas.getByText('Library')

        expect(roomName.getBoundingClientRect().top).toBeGreaterThanOrEqual(
            outerCircle.getBoundingClientRect().bottom,
        )
    },
}

export const RingSuccessFillsInnerCircle: Story = {
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        const room = canvas.getByRole('button', { name: 'Ring Library' })

        await userEvent.click(room)

        expect(args.onRing).toHaveBeenCalledTimes(1)
        await waitFor(() => expect(getInnerCircle(canvasElement)).toHaveAttribute('data-filled'))
        await waitFor(() =>
            expect(getComputedStyle(getInnerCircle(canvasElement)).backgroundColor).not.toBe(
                'rgba(0, 0, 0, 0)',
            ),
        )
        expect(room).toBeDisabled()
    },
}

export const PreventsRingingAgainWhileRung: Story = {
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        const room = canvas.getByRole('button', { name: 'Ring Library' })

        await userEvent.click(room)
        await waitFor(() => expect(getInnerCircle(canvasElement)).toHaveAttribute('data-filled'))

        // Stays rung well past the click, so the default lasts longer than a short delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await userEvent.click(room)

        expect(args.onRing).toHaveBeenCalledTimes(1)
        expect(room).toBeDisabled()
        expect(getInnerCircle(canvasElement)).toHaveAttribute('data-filled')
    },
}

export const RevertsToOutlineAfterRungDuration: Story = {
    args: {
        rungDuration: 500,
    },
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        const room = canvas.getByRole('button', { name: 'Ring Library' })

        await userEvent.click(room)
        await waitFor(() => expect(getInnerCircle(canvasElement)).toHaveAttribute('data-filled'))

        await waitFor(
            () => expect(getInnerCircle(canvasElement)).not.toHaveAttribute('data-filled'),
            { timeout: 2000 },
        )
        expect(room).toBeEnabled()

        await userEvent.click(room)

        expect(args.onRing).toHaveBeenCalledTimes(2)
        await waitFor(() => expect(getInnerCircle(canvasElement)).toHaveAttribute('data-filled'))
    },
}

export const PreventsRingingAgainWhileRequestInFlight: Story = {
    args: {
        onRing: fn(() => new Promise((resolve) => setTimeout(resolve, 500))),
    },
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        const room = canvas.getByRole('button', { name: 'Ring Library' })

        await userEvent.click(room)

        expect(room).toBeDisabled()
        expect(getInnerCircle(canvasElement)).not.toHaveAttribute('data-filled')

        await userEvent.click(room)

        expect(args.onRing).toHaveBeenCalledTimes(1)
        await waitFor(() => expect(getInnerCircle(canvasElement)).toHaveAttribute('data-filled'))
    },
}

export const RingFailureLeavesOutlineAndShowsError: Story = {
    args: {
        onRing: fn(async () => {
            throw new Error('Failed to ring bellboard')
        }),
    },
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        const room = canvas.getByRole('button', { name: 'Ring Library' })

        await userEvent.click(room)

        expect(args.onRing).toHaveBeenCalledTimes(1)
        await waitFor(() =>
            expect(
                canvasElement.ownerDocument.body.querySelector('[data-part="title"]'),
            ).toHaveTextContent('Failed to ring Library'),
        )
        expect(getInnerCircle(canvasElement)).not.toHaveAttribute('data-filled')
        expect(room).toBeEnabled()
    },
}
