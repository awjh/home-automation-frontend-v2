import { Collapsible as ChakraCollapsible, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { LuChevronDown } from 'react-icons/lu'

export interface CollapsibleProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}

// The outline wraps the header and, once opened, the content too
export default function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
    const { keyColors } = useColorMode()

    return (
        <ChakraCollapsible.Root
            defaultOpen={defaultOpen}
            w={'full'}
            borderColor={keyColors.primary}
            borderWidth={2}
            borderRadius={0}
        >
            <ChakraCollapsible.Trigger
                display={'flex'}
                alignItems={'center'}
                gap={4}
                w={'full'}
                px={4}
                py={3}
                cursor={'pointer'}
                color={keyColors.primary}
                bg={keyColors.secondary}
                _hover={{ bg: keyColors.subtle }}
                _open={{ bg: keyColors.subtle }}
            >
                <Text flex={1} textAlign={'start'} fontSize={{ base: 'md', md: 'lg' }}>
                    {title}
                </Text>
                <ChakraCollapsible.Indicator
                    display={'flex'}
                    transition={'transform 0.2s'}
                    _open={{ transform: 'rotate(180deg)' }}
                >
                    <LuChevronDown />
                </ChakraCollapsible.Indicator>
            </ChakraCollapsible.Trigger>
            <ChakraCollapsible.Content>{children}</ChakraCollapsible.Content>
        </ChakraCollapsible.Root>
    )
}
