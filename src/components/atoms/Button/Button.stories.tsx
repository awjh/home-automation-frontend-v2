import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import React from 'react'
import Button, { NonSubmitButtonProps } from './Button'

const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    decorators: [(Story) => <Story />],
    args: {
        children: 'Example button',
    },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const Primary: Story = {
    args: {
        colorStyle: 'primary',
    },
}

export const Secondary: Story = {
    args: {
        colorStyle: 'secondary',
    },
}

export const SubmitsForm: Story = {
    args: {
        type: 'submit',
        onSubmit: fn(),
    } as Story['args'],
    decorators: [
        (Story, { args }) => (
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    ;(args as unknown as { onSubmit: React.SubmitEventHandler }).onSubmit(e)
                }}
            >
                <Story />
            </form>
        ),
    ],
    play: async ({ canvas, args }) => {
        const button = canvas.getByRole('button', { name: /example button/i })
        expect(button).toHaveAttribute('type', 'submit')

        await button.click()
        expect(
            (args as unknown as { onSubmit: ReturnType<typeof fn> }).onSubmit,
        ).toHaveBeenCalledOnce()
    },
}

export const WithOnClick: Story = {
    args: {
        type: 'button',
        onClick: fn(),
    },
    play: async ({ canvas, args }) => {
        const button = canvas.getByRole('button', { name: /example button/i })
        expect(button).toHaveAttribute('type', 'button')

        await button.click()
        expect((args as NonSubmitButtonProps).onClick).toHaveBeenCalledOnce()
    },
}
