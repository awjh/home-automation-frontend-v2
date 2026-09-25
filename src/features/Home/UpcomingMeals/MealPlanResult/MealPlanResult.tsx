import ImageWithFallback from '@atoms/ImageWithFallback/ImageWithFallback'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { AspectRatio, Icon, Link, Text, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import NextLink from 'next/link'
import { LuSquareArrowOutUpRight } from 'react-icons/lu'
import UpcomingMeal from '../defs/UpcomingMeal'

export interface MealPlanResultProps {
    mealPlan: UpcomingMeal
}

// e.g. https://www.bbcgoodfood.com/recipes/... -> bbcgoodfood.com
function getWebsiteName(url: string): string | null {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return null
    }
}

function getSourceDetails(source: UpcomingMeal['source']): string | null {
    if (source.type === SourceType.BOOK) {
        return `${source.series ? `${source.series} - ` : ''}${source.title} (p. ${source.page})`
    }

    if (source.type === SourceType.MAGAZINE) {
        return `${source.title}, ${source.issue} (p. ${source.page})`
    }

    if (source.type === SourceType.ONLINE) {
        return getWebsiteName(source.url)
    }

    return null
}

function getTitle({ title, source }: UpcomingMeal): string {
    return source.type === SourceType.FREEZER ||
        source.type === SourceType.LEFTOVERS ||
        source.type === SourceType.READY_PREPARED
        ? `${title} (${source.type.replace('_', ' ')})`
        : title
}

export default function MealPlanResult({ mealPlan }: MealPlanResultProps) {
    const { keyColors } = useColorMode()
    const { source } = mealPlan
    const sourceDetails = getSourceDetails(source)
    const isLink = source.type === SourceType.ONLINE || source.type === SourceType.INTERNAL_RECIPE

    const contents = (
        <VStack
            alignItems={'stretch'}
            gap={3}
            w={'full'}
            color={keyColors.primary}
            data-testid={'upcoming-meal'}
            data-date={mealPlan.date}
            data-meal-time={mealPlan.mealTime}
            data-course={mealPlan.course}
            data-title={mealPlan.title}
        >
            <AspectRatio ratio={1} w={'full'}>
                <ImageWithFallback
                    w={'full'}
                    h={'full'}
                    src={mealPlan.image}
                    alt={mealPlan.title}
                    hideOnMobileOnError={false}
                />
            </AspectRatio>
            <VStack alignItems={'start'} gap={1}>
                <Text
                    as={'h3'}
                    fontSize={{ base: 'md', md: 'lg' }}
                    lineHeight={'short'}
                    _groupHover={isLink ? { textDecoration: 'underline' } : undefined}
                >
                    {getTitle(mealPlan)}
                    {isLink && (
                        <Icon ml={2} size={'sm'} verticalAlign={'middle'}>
                            <LuSquareArrowOutUpRight />
                        </Icon>
                    )}
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{mealPlan.author}</Text>
                {sourceDetails && <Text fontSize={{ base: 'sm', md: 'md' }}>{sourceDetails}</Text>}
            </VStack>
        </VStack>
    )

    if (source.type === SourceType.ONLINE) {
        return (
            <Link href={source.url} className={'group'} textDecoration={'none'} display={'block'}>
                {contents}
            </Link>
        )
    }

    if (source.type === SourceType.INTERNAL_RECIPE) {
        return (
            <Link asChild className={'group'} textDecoration={'none'} display={'block'}>
                <NextLink href={`/recipes/${source.recipeId}`}>{contents}</NextLink>
            </Link>
        )
    }

    return contents
}
