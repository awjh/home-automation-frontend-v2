import type { Meta, StoryObj } from '@storybook/react-vite'
import NavBarLink from './NavBarLink'

const meta: Meta<typeof NavBarLink> = {
    title: 'Atoms/NavBarLink',
    component: NavBarLink,
    decorators: [(Story) => <Story />],
    args: {
        href: '/recipes',
        children: 'Recipes',
    },
}

export default meta
type Story = StoryObj<typeof NavBarLink>

export const Default: Story = {}
