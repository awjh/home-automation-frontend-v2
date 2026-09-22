import Button from '@atoms/Button/Button'
import { Box, HStack } from '@chakra-ui/react'

export interface TabButtonsProps {
    tabs: (string | { name: string; counter: number })[]
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function TabButtons({ tabs, activeTab, onTabChange }: TabButtonsProps) {
    const tabNames = tabs.map((tab) => (typeof tab === 'object' && 'name' in tab ? tab.name : tab))
    const activeTabIndex = tabNames.indexOf(activeTab)

    return (
        <HStack w={'full'} gap={0} alignItems={'stretch'} justifyContent={'stretch'}>
            {tabs.map((tab, index) => {
                const isCounterTab = typeof tab === 'object' && 'name' in tab
                const tabName = isCounterTab ? tab!.name : tab

                return (
                    <Box key={tabName} flex={1}>
                        <Button
                            onClick={() => onTabChange(tabName)}
                            type={'button'}
                            colorStyle={'tab'}
                            active={activeTabIndex === index}
                            tabBorderSide={
                                activeTabIndex === -1 || index > activeTabIndex ? 'left' : 'right'
                            }
                            w={'full'}
                        >
                            {tabName} {isCounterTab ? `(${tab.counter})` : ''}
                        </Button>
                    </Box>
                )
            })}
        </HStack>
    )
}
