import Button from '@atoms/Button/Button'
import { Flex, HStack, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'

interface AreYouSureProps {
    title: string
    message: string
    onConfirm: () => void | Promise<void>
}

export default function AreYouSure(props: AreYouSureProps) {
    const { keyColors } = useColorMode()

    return (
        <Flex position={'fixed'} zIndex={100} justifyContent={'center'}>
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
            ></Flex>
            <VStack
                mt={20}
                zIndex={1}
                maxW={'450px'}
                w={'90%'}
                bg={keyColors.subtle}
                borderRadius={0}
                gap={2}
                borderWidth={2}
                borderColor={keyColors.primary}
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
                    {props.title}
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} color={keyColors.primary} p={2}>
                    {props.message}
                </Text>
                <HStack w={'full'} justifyContent={'space-between'} p={2}>
                    {/* TODO - hide on click */}
                    <Button type="button" colorStyle={'secondary'} onClick={() => undefined}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={props.onConfirm}>
                        Confirm
                    </Button>
                </HStack>
            </VStack>
        </Flex>
    )
}
