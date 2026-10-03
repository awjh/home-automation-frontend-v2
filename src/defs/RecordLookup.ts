import { PostRecordBody } from '@awjh/home-automation-v2-api-models'

// What a catalogue number search can tell us about a record. Any field may be missing as the
// matched release might not have complete data.
export type RecordLookupResult = Partial<Omit<PostRecordBody, 'catNo' | 'image'>> & {
    imageUrl?: string
}
