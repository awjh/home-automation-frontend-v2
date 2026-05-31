import type { Meta, StoryObj } from '@storybook/react-vite'
import MockDate from 'mockdate'
import OnlineRecipeWithImage from '@test/mockData/recipes/OnlineRecipeWithImage'
import { useEffect } from 'react'
import RecipeScreen from './RecipeScreen'

const mockingDate = new Date(2026, 4, 31)

function StoryWrapper(args: React.ComponentProps<typeof RecipeScreen>) {
    MockDate.set(mockingDate)

    useEffect(() => () => MockDate.reset(), [])

    return <RecipeScreen {...args} />
}

const meta: Meta<typeof RecipeScreen> = {
    title: 'Screens/RecipeScreen',
    component: RecipeScreen,
    parameters: {
        nextjs: {
            appDirectory: true,
        },
    },
    decorators: [(Story) => <Story />],
    render: (args) => <StoryWrapper {...args} />,
    args: {
        recipe: OnlineRecipeWithImage,
        dates: ['2026-06-02', '2026-06-09'],
    },
}

export default meta

type Story = StoryObj<typeof RecipeScreen>

export const Default: Story = {}
