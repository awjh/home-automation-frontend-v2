import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { useState } from 'react'
import TabButtons from './TabButtons'

const meta: Meta<typeof TabButtons> = {
    title: 'Atoms/TabButtons',
    component: TabButtons,
    args: {
        tabs: ['Ingredients', 'Method', 'Notes', 'Nutrition', 'Source'],
        activeTab: 'Ingredients',
        onTabChange: fn(),
    },
    render: function Render(args) {
        const [activeTab, setActiveTab] = useState(args.activeTab)

        return (
            <TabButtons
                {...args}
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab)
                    args.onTabChange(tab)
                }}
            />
        )
    },
}

export default meta
type Story = StoryObj<typeof TabButtons>

export const Default: Story = {}

export const SwitchesActiveTabStyling: Story = {
    play: async ({ canvas, userEvent, args }) => {
        const tabs = ['Ingredients', 'Method', 'Notes', 'Nutrition', 'Source']

        expect(canvas.getByRole('button', { name: /ingredients/i })).toHaveAttribute(
            'data-active',
            'true',
        )

        for (const tab of tabs) {
            const tabButton = canvas.getByRole('button', { name: tab })

            await userEvent.click(tabButton)

            expect(args.onTabChange).toHaveBeenCalledWith(tab)
            expect(tabButton).toHaveAttribute('data-active', 'true')

            for (const otherTab of tabs.filter((candidate) => candidate !== tab)) {
                expect(canvas.getByRole('button', { name: otherTab })).not.toHaveAttribute(
                    'data-active',
                )
            }
        }
    },
}
