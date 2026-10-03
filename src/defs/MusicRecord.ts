import { GetRecordResponse } from '@awjh/home-automation-v2-api-models'

// The package doesn't expose its db record types (MusicRecord, Song, Genre, Colour) as a
// subpath export yet, so derive them from the API response instead
type MusicRecord = GetRecordResponse

export type Song = MusicRecord['sides'][number]['songs'][number]
export type Genre = MusicRecord['tags']['genres'][number]
export type Colour = MusicRecord['tags']['colours'][number]

export default MusicRecord
