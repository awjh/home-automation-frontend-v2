'use client'

import { VStack } from '@chakra-ui/react'
import NavBar from '@features/NavBar/NavBar'
import AddRecord, { AddRecordProps } from '@features/Records/AddRecord/AddRecord'

export type AddRecordScreenProps = AddRecordProps

export default function AddRecordScreen(props: AddRecordScreenProps) {
    return (
        <VStack width={'full'}>
            <NavBar />
            <AddRecord {...props} />
        </VStack>
    )
}
