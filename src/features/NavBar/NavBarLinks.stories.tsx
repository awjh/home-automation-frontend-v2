import type { Meta, StoryObj } from '@storybook/react-vite'
import NavBarLinks from './NavBarLinks'

const meta: Meta<typeof NavBarLinks> = {
    title: 'Features/NavBar/NavBarLinks',
    component: NavBarLinks,
    decorators: [(Story) => <Story />],
    args: {
        links: [
            { href: '/recipes', label: 'Recipes' },
            { href: '/meal-planner', label: 'Meal Planner' },
            { href: '/records', label: 'Records' },
            { href: '/logout', label: 'Logout' },
        ],
    },
}

export default meta
type Story = StoryObj<typeof NavBarLinks>

export const Default: Story = {}
