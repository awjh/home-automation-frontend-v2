import { Button as ChakraButton } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset'
    children: React.ReactNode
    colorStyle?: 'primary' | 'secondary'
}

export default function Button({ type = 'submit', children, colorStyle = 'primary' }: ButtonProps) {
    const { keyColors } = useColorMode()

    return (
        <ChakraButton
            type={type}
            borderColor={keyColors.primary}
            borderWidth={2}
            bg={colorStyle === 'primary' ? keyColors.primary : keyColors.secondary}
            color={colorStyle === 'primary' ? keyColors.secondary : keyColors.primary}
            _hover={{ bg: keyColors.buttonHoverBg, color: keyColors.secondary }}
            borderRadius={0}
        >
            {children}
        </ChakraButton>
    )
}
