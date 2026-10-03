'use client'

import { VStack } from '@chakra-ui/react'
import { MusicRecord } from '@awjh/home-automation-v2-api-models/records'
import NavBar from '@features/NavBar/NavBar'
import ViewRecord from '@features/Records/ViewRecord/ViewRecord'

export interface RecordScreenProps {
    record: MusicRecord
}

export default function RecordScreen({ record }: RecordScreenProps) {
    return (
        <VStack width={'full'}>
            <NavBar />
            <VStack width={'full'} minHeight={'100vh'}>
                <ViewRecord record={record} />
            </VStack>
        </VStack>
    )
}
