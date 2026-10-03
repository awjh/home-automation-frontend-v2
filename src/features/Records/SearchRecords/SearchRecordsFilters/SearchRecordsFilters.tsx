import Button from '@atoms/Button/Button'
import { RecordFilters } from '@awjh/home-automation-v2-api-models'
import { RecordTags } from '@awjh/home-automation-v2-api-models/records'
import { Fieldset, HStack, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import TagSelector, { createTagSelection, TagSelection } from '@molecules/TagSelector/TagSelector'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'

// The formats and release types the records can be filtered to
type RecordFilterOptions = Required<RecordFilters>

const FILTER_LABELS: Record<keyof RecordFilterOptions, string> = {
    formats: 'Format',
    types: 'Release Type',
}

export interface SearchRecordsFiltersProps {
    tags: RecordTags
    filters: RecordFilters
    onApply: () => void
    onCancel: () => void
}

function parseJsonParam<T>(value: string | null): Partial<T> | undefined {
    if (!value) {
        return undefined
    }

    try {
        return JSON.parse(value) as Partial<T>
    } catch {
        return undefined
    }
}

// Only the groups with something selected are searched on, an empty group would match nothing
function withoutEmptyGroups(selection: Record<string, string[]>) {
    return Object.fromEntries(Object.entries(selection).filter(([, values]) => values.length > 0))
}

export default function SearchRecordsFilters({
    tags,
    filters,
    onApply,
    onCancel,
}: SearchRecordsFiltersProps) {
    const { keyColors } = useColorMode()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const filterOptions: RecordFilterOptions = {
        formats: filters.formats ?? [],
        types: filters.types ?? [],
    }

    const initialSelectedTags = createTagSelection(
        tags,
        parseJsonParam<TagSelection<RecordTags>>(searchParams.get('tags')),
    )
    const initialSelectedFilters = createTagSelection(
        filterOptions,
        parseJsonParam<TagSelection<RecordFilterOptions>>(searchParams.get('filters')),
    )

    const [selectedTags, setSelectedTags] = useState(initialSelectedTags)
    const [selectedFilters, setSelectedFilters] = useState(initialSelectedFilters)

    const handleCancel = () => {
        setSelectedTags(initialSelectedTags)
        setSelectedFilters(initialSelectedFilters)
        onCancel()
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextSearchParams = new URLSearchParams(searchParams.toString())

        Object.entries({ tags: selectedTags, filters: selectedFilters }).forEach(
            ([param, selection]) => {
                const selected = withoutEmptyGroups(selection)

                if (Object.keys(selected).length > 0) {
                    nextSearchParams.set(param, JSON.stringify(selected))
                } else {
                    nextSearchParams.delete(param)
                }
            },
        )

        const queryString = nextSearchParams.toString()
        const nextPath = queryString ? `${pathname}?${queryString}` : pathname

        router.push(nextPath)
        router.refresh()
        onApply()
    }

    return (
        <form noValidate onSubmit={handleSubmit}>
            <Fieldset.Root size={'lg'} maxW={'full'}>
                <VStack alignItems={'stretch'} gap={4}>
                    <Fieldset.Legend
                        color={keyColors.primary}
                        fontSize={'2xl'}
                        fontWeight={'bold'}
                        alignSelf={'start'}
                    >
                        Filters
                    </Fieldset.Legend>
                    <Fieldset.Content>
                        <TagSelector
                            tagOptions={tags}
                            selectedTags={selectedTags}
                            onSelectedTagsChange={setSelectedTags}
                        />
                        <TagSelector
                            tagOptions={filterOptions}
                            selectedTags={selectedFilters}
                            onSelectedTagsChange={setSelectedFilters}
                            labelFormatter={(group) => FILTER_LABELS[group]}
                        />
                    </Fieldset.Content>
                    <HStack justifyContent={'space-between'}>
                        <Button type={'button'} colorStyle={'secondary'} onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type={'submit'}>Apply Filters</Button>
                    </HStack>
                </VStack>
            </Fieldset.Root>
        </form>
    )
}
