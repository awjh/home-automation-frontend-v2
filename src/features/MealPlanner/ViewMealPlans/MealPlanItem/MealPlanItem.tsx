import { Flex, HStack, IconButton, Stack, Text, VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import useColorMode from '@hooks/useColorMode'
import formatDuration from '@utils/formatDuration'
import { LuSquarePen, LuTrash2 } from 'react-icons/lu'
import MealPlanBasicDetails from '../MealPlanBasicDetails/MealPlanBasicDetails'

interface MealPlanItemProps {
    mealPlan: MealPlan
    lastItem?: boolean
    onDelete: (mealPlan: MealPlan) => void
    onEdit: (mealPlan: MealPlan) => void
}

export default function MealPlanItem(props: MealPlanItemProps) {
    const { keyColors } = useColorMode()

    return (
        <VStack
            px={0}
            borderLeftWidth={2}
            borderColor={keyColors.primary}
            justifyContent={'start'}
            alignItems={'start'}
            ml={{ base: 2, sm: 4, md: 6 }}
            color={keyColors.primary}
            w={'full'}
            pb={props.lastItem ? 0 : 2}
            position={'relative'}
            _after={
                props.lastItem
                    ? undefined
                    : {
                          content: '""',
                          position: 'absolute',
                          bottom: '-6px',
                          left: '-2px',
                          width: '32px',
                          height: '16px',
                          borderColor: keyColors.primary,
                          borderBottomLeftRadius: 8,
                          borderBottomWidth: 2,
                          borderLeftWidth: 2,
                      }
            }
        >
            <Flex
                mt={2}
                py={1}
                px={2}
                bg={keyColors.primary}
                color={keyColors.secondary}
                fontSize={{ base: 'sm', md: 'md' }}
                textTransform={'capitalize'}
            >
                {props.mealPlan.course}
            </Flex>
            <Stack
                direction={{ base: 'column', md: 'row' }}
                width={'full'}
                p={0}
                pr={4}
                gap={{ base: 2, md: 4 }}
                alignItems={'start'}
            >
                <VStack px={6} flex={1} alignItems={'start'}>
                    <MealPlanBasicDetails mealPlan={props.mealPlan} />
                    <VStack alignItems={'start'} gap={0}>
                        <Text fontSize={{ base: 'md', md: 'lg' }}>
                            Duration:{' '}
                            {formatDuration(
                                props.mealPlan.duration.cookingDuration +
                                    props.mealPlan.duration.prepDuration,
                            )}
                        </Text>
                        <Text fontSize={{ base: 'md', md: 'lg' }}>
                            Standing time: {formatDuration(props.mealPlan.duration.standingTime)}
                        </Text>
                    </VStack>
                </VStack>
                <HStack pl={{ base: 4, md: 0 }}>
                    <IconButton
                        aria-label={'edit meal'}
                        color={keyColors.primary}
                        _hover={{
                            bg: keyColors.subtle,
                        }}
                        background={keyColors.secondary}
                        borderRadius={0}
                        onClick={() => props.onEdit(props.mealPlan)}
                    >
                        <LuSquarePen />
                    </IconButton>
                    <IconButton
                        aria-label={'delete meal'}
                        color={keyColors.primary}
                        _hover={{
                            bg: keyColors.subtle,
                        }}
                        background={keyColors.secondary}
                        borderRadius={0}
                        onClick={() => props.onDelete(props.mealPlan)}
                    >
                        <LuTrash2 />
                    </IconButton>
                </HStack>
            </Stack>
        </VStack>
    )
}
