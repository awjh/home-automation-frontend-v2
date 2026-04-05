import { Button as ChakraButton } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

export interface SubmitButtonProps {
    type: 'submit'
}

export interface NonSubmitButtonProps {
    type: 'button' | 'reset'
    onClick: () => void
}

export interface NormalButtonProps {
    colorStyle?: 'primary' | 'secondary'
    w?: string | number
    size?: 'sm' | 'md' | 'lg'
}

export interface LinkButtonProps {
    colorStyle: 'link'
}

export interface BaseButtonProps {
    children: React.ReactNode
    loading?: boolean
    loadingText?: string
}

export type ButtonProps = BaseButtonProps &
    (SubmitButtonProps | NonSubmitButtonProps) &
    (NormalButtonProps | LinkButtonProps)

export default function Button(props: ButtonProps) {
    const { keyColors } = useColorMode()
    const { type, children, colorStyle = 'primary' } = props

    let w: string | number | undefined = undefined
    let size: 'sm' | 'md' | 'lg' | undefined = undefined

    if (colorStyle === 'primary' || colorStyle === 'secondary') {
        w = (props as NormalButtonProps).w
        size = (props as NormalButtonProps).size
    }

    let onClick: (() => void) | undefined = undefined

    if (type === 'button' || type === 'reset') {
        onClick = props.onClick
    }

    return (
        <ChakraButton
            type={type}
            borderColor={colorStyle === 'link' ? 'transparent' : keyColors.primary}
            borderWidth={colorStyle === 'link' ? 0 : 2}
            bg={colorStyle === 'primary' ? keyColors.primary : 'transparent'}
            color={colorStyle === 'primary' ? keyColors.secondary : keyColors.primary}
            textDecoration={colorStyle === 'link' ? 'underline' : 'none'}
            p={colorStyle === 'link' ? 0 : 2}
            _hover={{
                bg: colorStyle === 'link' ? 'transparent' : keyColors.buttonHoverBg,
                color: colorStyle === 'link' ? keyColors.primary : keyColors.secondary,
                textDecoration: colorStyle === 'link' ? 'underline' : 'none',
            }}
            borderRadius={0}
            verticalAlign={colorStyle === 'link' ? 'baseline' : undefined}
            w={w}
            onClick={onClick}
            size={size}
            fontSize={colorStyle === 'link' ? 'inherit' : undefined}
            loading={props.loading}
            loadingText={props.loadingText}
        >
            {children}
        </ChakraButton>
    )
}
