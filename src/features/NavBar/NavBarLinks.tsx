import { Flex, IconButton, Stack, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { Fragment, useState } from 'react'
import { LuMenu } from 'react-icons/lu'
import NavBarLink from './NavBarLink'

interface NavBarLinksProps {
    links: { href: string; label: string }[]
}

export default function NavBarLinks({ links }: NavBarLinksProps) {
    const { keyColors } = useColorMode()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <VStack alignItems={'flex-end'} gap={0} position={'relative'}>
            <IconButton
                zIndex={100}
                w={0}
                display={{ base: 'flex', md: 'none' }}
                aria-label={'open navigation'}
                color={keyColors.primary}
                _hover={{
                    bg: keyColors.subtle,
                }}
                background={isOpen ? keyColors.subtle : keyColors.secondary}
                borderRadius={0}
                borderColor={isOpen ? keyColors.primary : keyColors.secondary}
                borderWidth={2}
                borderBottomWidth={isOpen ? 0 : 2}
                onClick={() => setIsOpen(!isOpen)}
            >
                <LuMenu />
            </IconButton>
            <Stack
                position={{ base: 'absolute', md: 'inherit' }}
                zIndex={99}
                top={{ base: 10, md: 0 }}
                right={'0'}
                direction={{ base: 'column', md: 'row' }}
                p={{ base: 2, md: 0 }}
                gap={{ base: 2, md: 4 }}
                w={{ base: 'calc(100vw - 31px)', md: 'auto' }}
                alignItems={{ base: 'flex-start', md: 'center' }}
                justifyContent={'flex-end'}
                display={{ base: isOpen ? 'flex' : 'none', md: 'flex' }}
                borderColor={keyColors.primary}
                borderWidth={{ base: 2, md: 0 }}
                backgroundColor={{
                    base: isOpen ? keyColors.subtle : keyColors.secondary,
                    md: 'transparent',
                }}
                mt={{ base: isOpen ? '-2px' : '-0.5', md: 0 }}
            >
                {links.map((link, idx) => (
                    <Fragment key={`nav-link-${idx}`}>
                        <NavBarLink href={link.href}>{link.label}</NavBarLink>
                        {idx < links.length - 1 && (
                            <Flex
                                display={{ base: 'none', md: 'flex' }}
                                w={'2px'}
                                h={5}
                                backgroundColor={keyColors.primary}
                            />
                        )}
                    </Fragment>
                ))}
            </Stack>
        </VStack>
    )
}
