import { GetRecordsResponse } from '@awjh/home-automation-v2-api-models'
import MockRecord from './MockRecord'

// A record as it comes back from a search, without its tracks
const MockRecordSearchResult: GetRecordsResponse[number] = {
    id: MockRecord.id,
    image: MockRecord.image,
    catNo: MockRecord.catNo,
    title: MockRecord.title,
    artists: MockRecord.artists,
    year: MockRecord.year,
    labels: MockRecord.labels,
    type: MockRecord.type,
    format: MockRecord.format,
    tags: MockRecord.tags,
}

export default MockRecordSearchResult
