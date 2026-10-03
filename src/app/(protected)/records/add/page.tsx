import type { Metadata } from 'next'
import AddRecordScreen from '@screens/AddRecordScreen/AddRecordScreen'
import { addRecord, getExternalRecord, searchExternalRecords, uploadRecordImage } from './actions'

export const metadata: Metadata = {
    title: 'Add Record',
}

export default function AddRecord() {
    return (
        <AddRecordScreen
            searchExternalRecords={searchExternalRecords}
            getExternalRecord={getExternalRecord}
            addRecord={addRecord}
            uploadRecordImage={uploadRecordImage}
        />
    )
}
