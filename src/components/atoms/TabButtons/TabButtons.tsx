import Button from '@atoms/Button/Button'
import { Box, HStack } from '@chakra-ui/react'

export interface TabButtonsProps {
    tabs: string[]
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function TabButtons({ tabs, activeTab, onTabChange }: TabButtonsProps) {
    const activeTabIndex = tabs.indexOf(activeTab)

    return (
        <HStack w={'full'} gap={0} alignItems={'stretch'} justifyContent={'stretch'}>
            {tabs.map((tab, index) => (
                <Box key={tab} flex={1}>
                    <Button
                        onClick={() => onTabChange(tab)}
                        type={'button'}
                        colorStyle={'tab'}
                        active={tab === activeTab}
                        tabBorderSide={
                            activeTabIndex === -1 || index > activeTabIndex ? 'left' : 'right'
                        }
                        w={'full'}
                    >
                        {tab}
                    </Button>
                </Box>
            ))}
        </HStack>
    )
}
