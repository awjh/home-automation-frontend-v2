import { GetExternalRecordsResponse } from '@awjh/home-automation-v2-api-models'
import { Colour, RecordFormat, ReleaseType } from '@awjh/home-automation-v2-api-models/records'
import MockRecord from './MockRecord'

const MockExternalRecords: GetExternalRecordsResponse = [
    {
        musicBrainzId: '0b6d4d55-8e3d-4b8c-9f5e-3f4c2a7d1e01',
        catNo: MockRecord.catNo,
        title: MockRecord.title,
        artists: MockRecord.artists,
        labels: MockRecord.labels,
        year: MockRecord.year,
        type: ReleaseType.ALBUM,
        format: RecordFormat.TWELVE_INCH,
        releaseDate: '1977-02-04',
        country: 'GB',
        barcode: '075992731310',
        colours: [],
        trackCount: 11,
        thumbnailUrl: 'https://coverartarchive.org/release/0b6d4d55/front-250',
    },
    {
        musicBrainzId: '7a1e9c3b-2f4d-4e6a-8b5c-9d0e1f2a3b02',
        catNo: MockRecord.catNo,
        title: MockRecord.title,
        artists: MockRecord.artists,
        labels: MockRecord.labels,
        year: 2017,
        format: RecordFormat.TWELVE_INCH,
        releaseDate: '2017',
        country: 'XE',
        disambiguation: 'red vinyl',
        colours: [Colour.RED],
        trackCount: 11,
        thumbnailUrl: 'https://coverartarchive.org/release/7a1e9c3b/front-250',
    },
]

export default MockExternalRecords
