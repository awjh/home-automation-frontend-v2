'use client'

import Button from '@atoms/Button/Button'
import { HStack, Input } from '@chakra-ui/react'
import useColorMode from '@hooks/useColorMode'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState, type FormEvent } from 'react'

function parseKeywordsFromSearchParams(searchParams: URLSearchParams): string {
    const keywordsFromSearchParams = searchParams.getAll('keywords')

    if (!keywordsFromSearchParams || keywordsFromSearchParams.length === 0) {
        return ''
    }

    const keywordValues = keywordsFromSearchParams
        .map((value) => value.trim())
        .filter((value) => value.length > 0)

    return keywordValues.join(' ')
}

export default function SearchRecipeKeywords() {
    const { keyColors } = useColorMode()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const initialKeywords = useMemo(
        () => parseKeywordsFromSearchParams(new URLSearchParams(searchParams.toString())),
        [searchParams],
    )
    const [keywordsInput, setKeywordsInput] = useState(initialKeywords)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const newParams = new URLSearchParams(searchParams.toString())
        newParams.delete('keywords')

        keywordsInput.split(/\s+/).forEach((keyword) => {
            newParams.append('keywords', keyword.trim())
        })

        const queryString = newParams.toString()
        const nextPath = queryString ? `${pathname}?${queryString}` : pathname

        router.push(nextPath)
        router.refresh()
    }

    return (
        <form noValidate onSubmit={handleSubmit}>
            <HStack w={'full'} alignItems={'start'} px={{ base: 2, md: 0 }} pb={{ base: 1, md: 0 }}>
                <Input
                    aria-label={'Search keywords'}
                    placeholder={'Search keywords'}
                    borderColor={keyColors.primary}
                    borderWidth={2}
                    borderRadius={0}
                    color={keyColors.primary}
                    pl={4}
                    value={keywordsInput}
                    onChange={(event) => {
                        setKeywordsInput(event.target.value)
                    }}
                />
                <Button type={'submit'} colorStyle={'secondary'}>
                    Search
                </Button>
            </HStack>
        </form>
    )
}
