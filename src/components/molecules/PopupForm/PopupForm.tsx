import useColorMode from '@hooks/useColorMode'
import { chakra, Flex, Text } from '@chakra-ui/react'

interface PopupFormProps {
    dataProps: Record<Lowercase<string>, string>
    heading: string
    onClose: () => void
    maxW?: string | number
}

export default function PopupForm(props: PopupFormProps & { children: React.ReactNode }) {
    const { keyColors } = useColorMode()

    return (
        <Flex position={'fixed'} w={'full'} zIndex={100} justifyContent={'center'}>
            <Flex
                position={'fixed'}
                left={0}
                top={0}
                right={0}
                bottom={0}
                justifyContent={'center'}
                alignItems={'center'}
                bg={keyColors.secondary}
                opacity={0.75}
                onClick={props.onClose}
            ></Flex>
            <chakra.div
                mt={20}
                zIndex={1}
                maxW={props.maxW ?? '450px'}
                w={'90%'}
                bg={keyColors.subtle}
                borderRadius={0}
                borderWidth={2}
                borderColor={keyColors.primary}
                display={'flex'}
                flexDirection={'column'}
                role={'dialog'}
                aria-modal={'true'}
                {...Object.fromEntries(
                    Object.entries(props.dataProps).map(([key, value]) => [`data-${key}`, value]),
                )}
            >
                <Text
                    color={keyColors.primary}
                    borderColor={keyColors.primary}
                    borderWidth={0}
                    borderBottomWidth={2}
                    w={'full'}
                    p={2}
                    fontSize={{ base: 'md', md: 'lg' }}
                >
                    {props.heading}
                </Text>
                <Flex
                    p={2}
                    flexDirection={'column'}
                    justifyContent={'start'}
                    alignItems={'start'}
                    w={'full'}
                    gap={4}
                >
                    {props.children}
                </Flex>
            </chakra.div>
        </Flex>
    )
}
