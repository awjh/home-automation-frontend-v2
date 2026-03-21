import { Heading, HStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import NavBarLinks from '@molecules/NavBarLinks/NavBarLinks'

export default function NavBar() {
    const { keyColors } = useColorMode()

    return (
        <HStack
            borderColor={keyColors.primary}
            borderBottomWidth={2}
            px={{ base: 2, sm: 3, md: 4 }}
            py={{ base: 2, sm: 4, md: 6 }}
            justifyContent={'start'}
            w={'full'}
            mb={6}
        >
            <Heading
                as={'h1'}
                flex={'1'}
                color={keyColors.primary}
                fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
            >
                Home Automation
            </Heading>
            <NavBarLinks
                links={[
                    { href: '/recipes', label: 'recipes' },
                    { href: '/meal-planner', label: 'meal planner' },
                    { href: '/records', label: 'records' },
                    { href: '/logout', label: 'logout' },
                ]}
            />
        </HStack>
    )
}
