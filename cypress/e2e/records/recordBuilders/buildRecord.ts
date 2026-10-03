import { PostRecordBody } from '@awjh/home-automation-v2-api-models'
import {
    Colour,
    Genre,
    RecordFormat,
    ReleaseType,
} from '@awjh/home-automation-v2-api-models/records'

export function buildRecord(
    title: string,
    overrides: Partial<PostRecordBody> = {},
): PostRecordBody {
    return {
        catNo: `CY ${Date.now()}`,
        title,
        artists: ['Cypress Artist'],
        labels: ['Cypress Label'],
        year: 2024,
        type: ReleaseType.ALBUM,
        format: RecordFormat.TWELVE_INCH,
        sides: [
            { name: 'A', songs: [{ title: 'Cypress Song A1', duration: 185 }] },
            { name: 'B', songs: [{ title: 'Cypress Song B1', duration: 200 }] },
        ],
        tags: { genres: [Genre.ROCK], colours: [Colour.BLACK] },
        ...overrides,
    }
}
