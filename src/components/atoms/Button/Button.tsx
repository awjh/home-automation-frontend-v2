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
    colorStyle?: 'primary' | 'secondary' | 'tab'
    w?: string | number
    size?: 'sm' | 'md' | 'lg'
}

export interface TabButtonStyleProps {
    colorStyle: 'tab'
    active?: boolean
    tabBorderSide?: 'left' | 'right'
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
    (NormalButtonProps | LinkButtonProps | TabButtonStyleProps)

export default function Button(props: ButtonProps) {
    const { keyColors } = useColorMode()
    const { type, children, colorStyle = 'primary' } = props
    const isTabButton = colorStyle === 'tab'
    const tabProps = props as TabButtonStyleProps
    const isActiveTab = isTabButton && Boolean(tabProps.active)
    const tabBorderSide =
        isTabButton && !isActiveTab ? (tabProps.tabBorderSide ?? 'left') : undefined

    let w: string | number | undefined = undefined
    let size: 'sm' | 'md' | 'lg' | undefined = undefined

    if (colorStyle === 'primary' || colorStyle === 'secondary' || colorStyle === 'tab') {
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
            borderColor={
                isTabButton
                    ? keyColors.primary
                    : colorStyle === 'link'
                      ? 'transparent'
                      : keyColors.primary
            }
            borderWidth={isTabButton ? 0 : colorStyle === 'link' ? 0 : 2}
            borderLeftWidth={isTabButton ? (tabBorderSide === 'left' ? 2 : 0) : undefined}
            borderRightWidth={isTabButton ? (tabBorderSide === 'right' ? 2 : 0) : undefined}
            borderBottomWidth={isTabButton ? (!isActiveTab ? 2 : 0) : undefined}
            bg={
                isTabButton
                    ? isActiveTab
                        ? keyColors.secondary
                        : keyColors.subtle
                    : colorStyle === 'primary'
                      ? keyColors.primary
                      : 'transparent'
            }
            color={
                isTabButton
                    ? keyColors.primary
                    : colorStyle === 'primary'
                      ? keyColors.secondary
                      : keyColors.primary
            }
            textDecoration={colorStyle === 'link' ? 'underline' : 'none'}
            p={colorStyle === 'link' ? 0 : 2}
            _hover={{
                bg: isTabButton
                    ? isActiveTab
                        ? keyColors.secondary
                        : keyColors.lessSubtle
                    : colorStyle === 'link'
                      ? 'transparent'
                      : keyColors.buttonHoverBg,
                color: isTabButton
                    ? keyColors.primary
                    : colorStyle === 'link'
                      ? keyColors.primary
                      : keyColors.secondary,
                textDecoration: colorStyle === 'link' ? 'underline' : 'none',
            }}
            borderRadius={0}
            verticalAlign={colorStyle === 'link' ? 'baseline' : undefined}
            w={w}
            onClick={onClick}
            size={size}
            fontSize={
                colorStyle === 'link'
                    ? 'inherit'
                    : colorStyle === 'tab'
                      ? { base: 'md', md: 'lg' }
                      : undefined
            }
            loading={props.loading}
            loadingText={props.loadingText}
            data-active={isTabButton && isActiveTab ? 'true' : undefined}
            data-tab-border-side={tabBorderSide}
        >
            {children}
        </ChakraButton>
    )
}
