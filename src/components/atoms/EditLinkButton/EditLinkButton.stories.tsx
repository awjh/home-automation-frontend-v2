import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import EditLinkButton from './EditLinkButton'

const meta: Meta<typeof EditLinkButton> = {
    title: 'Atoms/EditLinkButton',
    component: EditLinkButton,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    args: {
        href: '/recipes/123/edit',
        label: 'Edit recipe',
    },
}

export default meta

type Story = StoryObj<typeof EditLinkButton>

export const Default: Story = {
    play: async ({ canvas }) => {
        expect(canvas.getByRole('link', { name: /edit recipe/i })).toHaveAttribute(
            'href',
            '/recipes/123/edit',
        )
    },
}
