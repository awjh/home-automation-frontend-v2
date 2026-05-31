import { Box } from '@chakra-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import ImageWithFallback from './ImageWithFallback'

const meta: Meta<typeof ImageWithFallback> = {
    title: 'Atoms/ImageWithFallback',
    component: ImageWithFallback,
    decorators: [
        (Story) => (
            <Box p={6}>
                <Story />
            </Box>
        ),
    ],
    args: {
        w: '12rem',
        h: '8rem',
        alt: 'Example image',
    },
}

export default meta
type Story = StoryObj<typeof ImageWithFallback>

export const ValidImage: Story = {
    args: {
        src: '/recipe.jpg',
    },
}

export const Fallback: Story = {
    args: {
        src: '/missing-image.png',
        alt: 'Missing image example',
    },
}
