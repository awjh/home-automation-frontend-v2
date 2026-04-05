import { Icon, Link, Text, VStack } from '@chakra-ui/react'
import MealPlan from '@defs/MealPlan'
import useColorMode from '@hooks/useColorMode'
import { LuSquareArrowOutUpRight } from 'react-icons/lu'

interface MealPlanLinkProps {
    mealPlan: MealPlan
}

export default function MealPlanBasicDetails(props: MealPlanLinkProps) {
    const { keyColors } = useColorMode()

    const { title, author, source } = props.mealPlan

    const formattedTitle =
        source.type === 'freezer' || source.type === 'leftovers' || source.type === 'ready_prepared'
            ? `${title} (${source.type})`
            : title

    const isLink = source.type === 'online' || source.type === 'internal'

    const coreContents = (
        <VStack color={keyColors.primary} alignItems={'start'} gap={0}>
            <Text fontSize={{ base: 'lg', md: 'xl' }}>
                {formattedTitle}{' '}
                {isLink && (
                    <Icon ml={1} size={{ base: 'md', md: 'lg' }}>
                        <LuSquareArrowOutUpRight />
                    </Icon>
                )}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }}>{author}</Text>
            {source.type === 'book' && (
                <Text fontSize={{ base: 'md', md: 'lg' }}>
                    {source.series ? `${source.series} - ` : ''}
                    {source.title} {`(p. ${source.page})`}
                </Text>
            )}
        </VStack>
    )

    if (!isLink) {
        return coreContents
    }

    return (
        <Link
            href={source.type === 'online' ? source.url : `/recipes/${source.recipeId}`}
            textDecoration={'none'}
            _hover={{
                textDecoration: 'underline',
            }}
            color={keyColors.primary}
        >
            {coreContents}
        </Link>
    )
}
