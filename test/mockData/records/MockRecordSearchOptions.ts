import { RecordFilters } from '@awjh/home-automation-v2-api-models'
import {
    Colour,
    Genre,
    RecordFormat,
    RecordTags,
    ReleaseType,
} from '@awjh/home-automation-v2-api-models/records'

export const MockRecordSearchTags: RecordTags = {
    genres: Object.values(Genre),
    colours: Object.values(Colour),
}

export const MockRecordSearchFilters: Required<RecordFilters> = {
    formats: Object.values(RecordFormat),
    types: Object.values(ReleaseType),
}
