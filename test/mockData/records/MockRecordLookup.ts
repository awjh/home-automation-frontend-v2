import { RecordLookupResult } from '@defs/RecordLookup'
import MockRecord from './MockRecord'

const MockRecordLookup: RecordLookupResult = {
    title: MockRecord.title,
    artists: MockRecord.artists,
    labels: MockRecord.labels,
    year: MockRecord.year,
    type: MockRecord.type,
    format: MockRecord.format,
    sides: MockRecord.sides,
    tags: MockRecord.tags,
}

export default MockRecordLookup
