import { Flex } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

export interface TagProps {
    value: string
    status?: 'subtle' | 'highlighted' | 'default'
    onClick?: () => void
}

export default function Tag({ status = 'default', value, onClick }: TagProps) {
    const { keyColors } = useColorMode()

    const backgroundColor =
        status === 'highlighted'
            ? keyColors.primary
            : status === 'subtle'
              ? keyColors.subtle
              : keyColors.secondary

    const textColor = status === 'highlighted' ? 'white' : keyColors.primary

    const hoverBackgroundColor =
        status === 'highlighted'
            ? keyColors.secondary
            : status === 'subtle'
              ? keyColors.primary
              : keyColors.subtle

    const hoverTextColor = status === 'subtle' ? 'white' : keyColors.primary

    return (
        <Flex
            as={onClick ? 'button' : 'div'}
            display={'inline-flex'}
            data-status={status}
            w={'fit-content'}
            alignSelf={'flex-start'}
            borderWidth={'1px'}
            bg={backgroundColor}
            color={textColor}
            borderColor={keyColors.primary}
            cursor={onClick ? 'pointer' : 'default'}
            py={1}
            px={2}
            onClick={onClick}
            _hover={
                onClick
                    ? {
                          bg: hoverBackgroundColor,
                          color: hoverTextColor,
                      }
                    : undefined
            }
            textTransform={'capitalize'}
            fontSize={'sm'}
        >
            {value}
        </Flex>
    )
}
