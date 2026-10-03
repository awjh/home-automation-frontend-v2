import type { Metadata } from 'next'
import RecordScreen from '@screens/RecordScreen/RecordScreen'
import { getRecordImageUrl } from './actions'
import getCachedRecord from './getCachedRecord'

interface ViewRecordProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ViewRecordProps): Promise<Metadata> {
    const { id } = await params
    const record = await getCachedRecord(id)

    return {
        title: [record.title, record.artists.join(', ')].filter(Boolean).join(' - '),
    }
}

export default async function ViewRecord({ params }: ViewRecordProps) {
    const { id } = await params
    const record = await getCachedRecord(id)
    const resolvedImage = await getRecordImageUrl(record.image)

    return <RecordScreen record={{ ...record, image: resolvedImage }} />
}
