import { HStack, StackSeparator, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { ReactNode } from 'react'

export interface DescriptionTableProps {
    data: {
        key: string
        value: ReactNode
    }[]
}

export default function DescriptionTable({ data }: DescriptionTableProps) {
    const { keyColors } = useColorMode()

    return (
        <HStack
            pt={'0'}
            gap={4}
            color={keyColors.primary}
            separator={
                <StackSeparator
                    borderInlineStartWidth={'2px'}
                    borderStyle={'dotted'}
                    borderColor={keyColors.primary}
                />
            }
        >
            {data.map(({ key, value }) => (
                <VStack
                    fontSize={{ base: 'sm', md: 'sm', lg: 'md' }}
                    fontFamily={'lekton'}
                    key={`description-table-${key}`}
                    gap={1}
                >
                    <Text textTransform={'capitalize'}>{key}</Text>
                    <Text textTransform={'none'} fontWeight={'bold'}>
                        {value}
                    </Text>
                </VStack>
            ))}
        </HStack>
    )
}
