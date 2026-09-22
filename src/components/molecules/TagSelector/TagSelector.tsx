import Tag from '@atoms/Tag/Tag'
import { Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import splitCamelCaseToWords from '@utils/splitCamelCaseToWords'

export type TagOptions = Record<string, string[]>

export type TagSelection<T extends TagOptions> = {
    [K in keyof T]: T[K][number][]
}

export function createTagSelection<T extends TagOptions>(
    tagOptions: T,
    initialSelection?: Partial<TagSelection<T>>,
): TagSelection<T> {
    return Object.keys(tagOptions).reduce((acc, groupLabel) => {
        const key = groupLabel as keyof T
        acc[key] = [...(initialSelection?.[key] ?? [])]
        return acc
    }, {} as TagSelection<T>)
}

interface TagSelectorProps<T extends TagOptions> {
    tagOptions: T
    selectedTags: TagSelection<T>
    onSelectedTagsChange: (selectedTags: TagSelection<T>) => void
    labelFormatter?: (groupLabel: keyof T & string) => string
}

export default function TagSelector<T extends TagOptions>({
    tagOptions,
    selectedTags,
    onSelectedTagsChange,
    labelFormatter,
}: TagSelectorProps<T>) {
    const { keyColors } = useColorMode()

    const formatGroupLabel =
        labelFormatter ?? ((groupLabel: keyof T & string) => splitCamelCaseToWords(groupLabel))

    const toggleSelection = <K extends keyof T & string>(groupLabel: K, value: T[K][number]) => {
        const currentSelections = selectedTags[groupLabel] ?? []
        const selectedValues = new Set(currentSelections)

        if (selectedValues.has(value)) {
            selectedValues.delete(value)
        } else {
            selectedValues.add(value)
        }

        onSelectedTagsChange({
            ...selectedTags,
            [groupLabel]: Array.from(selectedValues),
        })
    }

    return (
        <VStack alignItems={'stretch'} gap={4}>
            {Object.entries(tagOptions).map(([groupLabel, options]) => {
                const selectedValues = new Set(selectedTags[groupLabel as keyof T] ?? [])

                return (
                    <VStack key={groupLabel} alignItems={'stretch'} gap={2}>
                        <Text
                            color={keyColors.primary}
                            fontWeight={'bold'}
                            textTransform={'capitalize'}
                            fontSize={'lg'}
                        >
                            {formatGroupLabel(groupLabel as keyof T & string)}
                        </Text>
                        <Wrap gap={2}>
                            {options.map((option) => (
                                <WrapItem key={option}>
                                    <Tag
                                        value={option}
                                        status={
                                            selectedValues.has(option) ? 'highlighted' : 'default'
                                        }
                                        onClick={() => {
                                            toggleSelection(groupLabel as keyof T & string, option)
                                        }}
                                    />
                                </WrapItem>
                            ))}
                        </Wrap>
                    </VStack>
                )
            })}
        </VStack>
    )
}
