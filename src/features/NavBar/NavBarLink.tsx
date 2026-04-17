import { Link } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

interface NavBarLinkProps {
    href: string
    children: React.ReactNode
}

export default function NavBarLink({ href, children }: NavBarLinkProps) {
    const { keyColors } = useColorMode()

    return (
        <Link
            textTransform={'capitalize'}
            href={href}
            color={keyColors.primary}
            _hover={{ textDecoration: 'underline', color: keyColors.primary }}
        >
            {children}
        </Link>
    )
}