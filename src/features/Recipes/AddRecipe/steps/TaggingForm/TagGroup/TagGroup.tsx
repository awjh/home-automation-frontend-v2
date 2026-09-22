import Tag from '@atoms/Tag/Tag'
import { Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import splitCamelCaseToWords from '@utils/splitCamelCaseToWords'
import { useState } from 'react'

interface TagGroupProps {
    initialSelectedTags: string[]
    groupLabel: string
    options: string[]
    onTagClicked: (newSelections: string[]) => void
}

export default function TagGroup({
    initialSelectedTags,
    groupLabel,
    options,
    onTagClicked,
}: TagGroupProps) {
    const { keyColors } = useColorMode()
    const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set(initialSelectedTags))

    const toggleSelection = (value: string) => {
        let nextValues: Set<string>

        if (selectedValues.has(value)) {
            nextValues = new Set(selectedValues)
            nextValues.delete(value)
        } else {
            nextValues = new Set(selectedValues)
            nextValues.add(value)
        }

        setSelectedValues(nextValues)
        onTagClicked(Array.from(nextValues))
    }

    return (
        <VStack alignItems={'stretch'} gap={2}>
            <Text color={keyColors.primary} fontWeight={'bold'} textTransform={'capitalize'}>
                {splitCamelCaseToWords(groupLabel)}
            </Text>
            <Wrap gap={2}>
                {options.map((option) => (
                    <WrapItem key={option}>
                        <Tag
                            value={option}
                            status={selectedValues.has(option) ? 'highlighted' : 'default'}
                            onClick={() => {
                                toggleSelection(option)
                            }}
                        />
                    </WrapItem>
                ))}
            </Wrap>
        </VStack>
    )
}
