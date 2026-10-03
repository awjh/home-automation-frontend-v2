'use client'

import { VStack } from '@chakra-ui/react'
import NavBar from '@features/NavBar/NavBar'
import SearchRecords, { SearchRecordsProps } from '@features/Records/SearchRecords/SearchRecords'

export type SearchRecordScreenProps = SearchRecordsProps

export default function SearchRecordScreen(props: SearchRecordScreenProps) {
    return (
        <VStack w="full">
            <NavBar />
            <SearchRecords {...props} />
        </VStack>
    )
}
