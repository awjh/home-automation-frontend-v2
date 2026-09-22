import TabButtons from '@atoms/TabButtons/TabButtons'
import { Box, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export interface TabbedContentProps {
    childrenByTab: Record<
        string,
        | React.ReactNode
        | {
              counter: number
              content: React.ReactNode
          }
    >
    initialActiveTab?: string
    onTabChange?: (tab: string) => void
}

export default function TabbedContent({
    childrenByTab,
    initialActiveTab,
    onTabChange,
}: TabbedContentProps) {
    const tabs = Object.entries(childrenByTab).map(([tabName, tab]) =>
        typeof tab === 'object' && 'counter' in tab!
            ? {
                  name: tabName,
                  counter: tab.counter,
              }
            : tabName,
    )
    const tabNames = tabs.map((tab) => (typeof tab === 'string' ? tab : tab.name))
    const fallbackTab = tabNames[0]
    const [activeTab, setActiveTab] = useState(initialActiveTab ?? fallbackTab)

    useEffect(() => {
        if (!tabNames.length) {
            return
        }

        if (!activeTab || !tabNames.includes(activeTab)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveTab(
                initialActiveTab && tabNames.includes(initialActiveTab)
                    ? initialActiveTab
                    : fallbackTab,
            )
        }
    }, [activeTab, fallbackTab, initialActiveTab, tabNames])

    if (!fallbackTab) {
        return null
    }

    const selectedTab = activeTab && tabNames.includes(activeTab) ? activeTab : fallbackTab

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
                {typeof childrenByTab[selectedTab] === 'object' &&
                'counter' in childrenByTab[selectedTab]!
                    ? childrenByTab[selectedTab].content
                    : childrenByTab[selectedTab]}
            </Box>
        </VStack>
    )
}
