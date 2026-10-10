import { IconButton } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import NextLink from 'next/link'
import { LuPencil } from 'react-icons/lu'

export interface EditLinkButtonProps {
    href: string
    label: string
}

export default function EditLinkButton({ href, label }: EditLinkButtonProps) {
    const { keyColors } = useColorMode()

    return (
        <IconButton
            asChild
            aria-label={label}
            color={keyColors.primary}
            _hover={{
                bg: keyColors.subtle,
            }}
            background={keyColors.secondary}
            borderRadius={0}
            flexShrink={0}
            data-testid={'edit-link-button'}
        >
            <NextLink href={href}>
                <LuPencil />
            </NextLink>
        </IconButton>
    )
}
