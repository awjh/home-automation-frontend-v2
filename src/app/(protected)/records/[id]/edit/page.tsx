import type { Metadata } from 'next'
import AddRecordScreen from '@screens/AddRecordScreen/AddRecordScreen'
import { getExternalRecord, searchExternalRecords } from '../../add/actions'
import getCachedRecord from '../getCachedRecord'
import { editRecord } from './actions'

interface EditRecordPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditRecordPageProps): Promise<Metadata> {
    const { id } = await params
    const record = await getCachedRecord(id)

    return {
        title: `Edit ${record.title}`,
    }
}

export default async function EditRecordPage({ params }: EditRecordPageProps) {
    const { id } = await params
    const record = await getCachedRecord(id)

    return (
        <AddRecordScreen
            record={record}
            editRecord={editRecord}
            searchExternalRecords={searchExternalRecords}
            getExternalRecord={getExternalRecord}
        />
    )
}
