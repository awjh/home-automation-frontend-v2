import TabButtons from '@atoms/TabButtons/TabButtons'
import { Box, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export interface TabbedContentProps {
    childrenByTab: Record<string, React.ReactNode>
    initialActiveTab?: string
    onTabChange?: (tab: string) => void
}

export default function TabbedContent({
    childrenByTab,
    initialActiveTab,
    onTabChange,
}: TabbedContentProps) {
    const tabs = Object.keys(childrenByTab)
    const fallbackTab = tabs[0]
    const [activeTab, setActiveTab] = useState(initialActiveTab ?? fallbackTab)

    useEffect(() => {
        if (!tabs.length) {
            return
        }

        if (!activeTab || !tabs.includes(activeTab)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveTab(
                initialActiveTab && tabs.includes(initialActiveTab)
                    ? initialActiveTab
                    : fallbackTab,
            )
        }
    }, [activeTab, fallbackTab, initialActiveTab, tabs])

    if (!fallbackTab) {
        return null
    }

    const selectedTab = activeTab && tabs.includes(activeTab) ? activeTab : fallbackTab

    return (
        <VStack w={'full'} gap={0} alignItems={'stretch'}>
            <TabButtons
                tabs={tabs}
                activeTab={selectedTab}
                onTabChange={(tab) => {
                    setActiveTab(tab)
                    onTabChange?.(tab)
                }}
            />
            <Box w={'full'} data-active-tab={selectedTab}>
                {childrenByTab[selectedTab]}
            </Box>
        </VStack>
    )
}
