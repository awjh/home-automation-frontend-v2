import { Button as ChakraButton } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

export interface SubmitButtonProps {
    type: 'submit'
}

export interface NonSubmitButtonProps {
    type: 'button' | 'reset'
    onClick: () => void
}

export interface BaseButtonProps {
    children: React.ReactNode
    colorStyle?: 'primary' | 'secondary'
    w?: string | number
    size?: 'sm' | 'md' | 'lg'
}

export type ButtonProps = BaseButtonProps & (SubmitButtonProps | NonSubmitButtonProps)

export default function Button(props: ButtonProps) {
    const { keyColors } = useColorMode()
    const { type, children, colorStyle = 'primary', w, size } = props

    let onClick: (() => void) | undefined = undefined

    if (type === 'button' || type === 'reset') {
        onClick = props.onClick
    }

    return (
        <ChakraButton
            type={type}
            borderColor={keyColors.primary}
            borderWidth={2}
            bg={colorStyle === 'primary' ? keyColors.primary : keyColors.secondary}
            color={colorStyle === 'primary' ? keyColors.secondary : keyColors.primary}
            _hover={{ bg: keyColors.buttonHoverBg, color: keyColors.secondary }}
            borderRadius={0}
            w={w}
            onClick={onClick}
            size={size}
        >
            {children}
        </ChakraButton>
    )
}
