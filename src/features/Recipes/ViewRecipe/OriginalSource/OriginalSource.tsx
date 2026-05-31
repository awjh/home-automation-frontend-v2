import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { OriginalSource as RecipeOriginalSource } from '@awjh/home-automation-v2-api-models/recipes'
import { Icon, Link, Text } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { LuExternalLink } from 'react-icons/lu'

export interface OriginalSourceProps {
    source: RecipeOriginalSource
}

function getSourceLabel(url: string) {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return url
    }
}

export default function OriginalSource({ source }: OriginalSourceProps) {
    const { keyColors } = useColorMode()

    switch (source.type) {
        case SourceType.ONLINE:
            return (
                <Link
                    href={source.url}
                    color={keyColors.primary}
                    textDecoration={'underline'}
                    _hover={{
                        textDecoration: 'none',
                    }}
                >
                    {getSourceLabel(source.url)}
                    <Icon as={LuExternalLink} boxSize={3} />
                </Link>
            )
        case SourceType.MAGAZINE:
            return (
                <Text color={keyColors.primary}>
                    {source.title}, Issue: {source.issue}, Page: {source.page}
                </Text>
            )
        case SourceType.BOOK:
            return (
                <Text color={keyColors.primary}>
                    {source.title}, Page: {source.page}
                </Text>
            )
    }
}
