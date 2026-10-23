import type { Meta, StoryObj } from '@storybook/react-vite'
import MockBellboards from '@test/mockData/bellboards/MockBellboards'
import { expect, fn, waitFor, within } from 'storybook/test'
import Bellboards from './Bellboards'

const meta: Meta<typeof Bellboards> = {
    title: 'Features/Bellboards/Bellboards',
    component: Bellboards,
    args: {
        bellboards: MockBellboards,
        ringBellboard: fn(async () => ({ eventId: '0b6f5f5e-8a8f-4c1e-9f3b-2a1d6e7c8b9a' })),
    },
}

export default meta
type Story = StoryObj<typeof Bellboards>

export const Default: Story = {
    play: async ({ canvas }) => {
        for (const bellboard of MockBellboards) {
            expect(canvas.getByRole('button', { name: bellboard.bellboardName })).toHaveAttribute(
                'aria-expanded',
                'false',
            )

            for (const room of bellboard.rooms) {
                expect(
                    canvas.getByRole('button', { name: `Ring ${room}`, hidden: true }),
                ).not.toBeVisible()
            }
        }
    },
}

export const OpensBellboardToShowRooms: Story = {
    play: async ({ canvas, canvasElement, userEvent }) => {
        const [mainHouse, servantsHall] = MockBellboards

        await userEvent.click(canvas.getByRole('button', { name: mainHouse.bellboardName }))

        for (const room of mainHouse.rooms) {
            await waitFor(() =>
                expect(canvas.getByRole('button', { name: `Ring ${room}` })).toBeVisible(),
            )
        }

        for (const room of servantsHall.rooms) {
            expect(
                canvas.getByRole('button', { name: `Ring ${room}`, hidden: true }),
            ).not.toBeVisible()
        }

        // The section's outline wraps its rooms
        const section = canvasElement.querySelectorAll('[data-part="root"]')[0] as HTMLElement

        for (const room of mainHouse.rooms) {
            expect(
                within(section).getByRole('button', { name: `Ring ${room}` }),
            ).toBeInTheDocument()
        }
    },
}

export const RoomsDisplayAsGrid: Story = {
    play: async ({ canvas, userEvent }) => {
        const [mainHouse] = MockBellboards

        await userEvent.click(canvas.getByRole('button', { name: mainHouse.bellboardName }))

        const firstRoom = canvas.getByRole('button', { name: `Ring ${mainHouse.rooms[0]}` })

        await waitFor(() => expect(firstRoom).toBeVisible())

        expect(getComputedStyle(firstRoom.parentElement as HTMLElement).display).toBe('grid')
    },
}

export const RingsRoomOnItsBellboard: Story = {
    play: async ({ canvas, canvasElement, userEvent, args }) => {
        const [, servantsHall] = MockBellboards

        await userEvent.click(canvas.getByRole('button', { name: servantsHall.bellboardName }))

        const room = canvas.getByRole('button', { name: 'Ring Pantry' })

        await waitFor(() => expect(room).toBeVisible())
        await userEvent.click(room)

        expect(args.ringBellboard).toHaveBeenCalledTimes(1)
        expect(args.ringBellboard).toHaveBeenCalledWith('Servants Hall', 'Pantry')
        await waitFor(() =>
            expect(room.querySelector('[data-part="inner-circle"]')).toHaveAttribute('data-filled'),
        )

        // Only the rung room fills
        const otherInnerCircles = Array.from(
            canvasElement.querySelectorAll('[data-part="inner-circle"]'),
        ).filter((circle) => !room.contains(circle))

        for (const circle of otherInnerCircles) {
            expect(circle).not.toHaveAttribute('data-filled')
        }
    },
}

export const StaysRungWhenCollapsedAndReopened: Story = {
    play: async ({ canvas, userEvent, args }) => {
        const [mainHouse] = MockBellboards
        const trigger = canvas.getByRole('button', { name: mainHouse.bellboardName })

        await userEvent.click(trigger)

        const room = canvas.getByRole('button', { name: 'Ring Library' })

        await waitFor(() => expect(room).toBeVisible())
        await userEvent.click(room)
        await waitFor(() => expect(room).toBeDisabled())

        await userEvent.click(trigger)
        await waitFor(() => expect(room).not.toBeVisible())
        await userEvent.click(trigger)
        await waitFor(() => expect(room).toBeVisible())

        expect(room).toBeDisabled()
        expect(room.querySelector('[data-part="inner-circle"]')).toHaveAttribute('data-filled')
        expect(args.ringBellboard).toHaveBeenCalledTimes(1)
    },
}

export const NoBellboards: Story = {
    args: {
        bellboards: [],
    },
    play: async ({ canvas }) => {
        expect(canvas.getByText('No bellboards found')).toBeVisible()
    },
}
