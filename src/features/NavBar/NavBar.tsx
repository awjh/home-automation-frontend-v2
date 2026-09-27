import { Heading, HStack, Link } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import NavBarLinks from './NavBarLinks'

interface NavBarProps {
    showLinks?: boolean
}

export default function NavBar({ showLinks = true }: NavBarProps) {
    const { keyColors } = useColorMode()

    return (
        <HStack
            borderColor={keyColors.primary}
            borderBottomWidth={2}
            px={{ base: 2, sm: 3, md: 4 }}
            py={{ base: 2, sm: 4, md: 6 }}
            justifyContent={'start'}
            w={'full'}
            mb={{ base: 1, sm: 2, md: 4 }}
            boxSizing={'border-box'}
        >
            <Heading
                as={'h1'}
                flex={'1'}
                color={keyColors.primary}
                fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
                fontWeight={'normal'}
            >
                <Link
                    href={'/'}
                    color={keyColors.primary}
                    _hover={{ textDecoration: 'underline', color: keyColors.primary }}
                >
                    Home Automation
                </Link>
            </Heading>
            {showLinks && (
                <NavBarLinks
                    links={[
                        { href: '/recipes', label: 'recipes' },
                        { href: '/meal-plans', label: 'meal plans' },
                        { href: '/records', label: 'records' },
                        { href: '/logout', label: 'logout' },
                    ]}
                />
            )}
        </HStack>
    )
}
