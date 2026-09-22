import Button from '@atoms/Button/Button'
import { SearchDefs } from '@awjh/home-automation-v2-api-models'
import { RecipeTags } from '@awjh/home-automation-v2-api-models/recipes'
import { Fieldset, HStack, VStack } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import TagSelector, { TagSelection } from '@molecules/TagSelector/TagSelector'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import SlidingFilters from '../../../../components/molecules/SlidingFilters/SlidingFilters'

export interface SearchRecipesFiltersProps {
    tags: RecipeTags
    filters: SearchDefs.RecipeFilters
    onCancel: () => void
}

function parseJsonParam<T>(value: string | null, fallback: T): T {
    if (!value) {
        return fallback
    }

    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}

export default function SearchRecipesFilters({
    tags,
    filters,
    onCancel,
}: SearchRecipesFiltersProps) {
    const { keyColors } = useColorMode()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const defaultSelectedTags = {
        cuisine: [],
        mealType: [],
        meat: [],
        dietary: [],
        occasion: [],
        equipment: [],
    } as TagSelection<RecipeTags>

    const initialSelectedTags = parseJsonParam<TagSelection<RecipeTags>>(
        searchParams.get('tags'),
        defaultSelectedTags,
    )
    const initialFilters = parseJsonParam<SearchDefs.RecipeFilters>(
        searchParams.get('filters'),
        filters,
    )

    const [selectedTags, setSelectedTags] = useState<TagSelection<RecipeTags>>(initialSelectedTags)

    const methods = useForm<SearchDefs.RecipeFilters>({
        defaultValues: initialFilters,
    })

    const handleCancel = () => {
        methods.reset(initialFilters)
        setSelectedTags(initialSelectedTags)
        onCancel()
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextSearchParams = new URLSearchParams(searchParams.toString())
        nextSearchParams.delete('tags')

        nextSearchParams.append('tags', JSON.stringify(selectedTags))
        nextSearchParams.append('filters', JSON.stringify(methods.getValues()))

        const queryString = nextSearchParams.toString()
        const nextPath = queryString ? `${pathname}?${queryString}` : pathname

        router.push(nextPath)
        router.refresh()
    }

    return (
        <FormProvider {...methods}>
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
                            <SlidingFilters<SearchDefs.RecipeFilters> filters={filters} />
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
        </FormProvider>
    )
}
