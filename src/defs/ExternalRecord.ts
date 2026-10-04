import { GetExternalRecordsResponse } from '@awjh/home-automation-v2-api-models'

// A pressing found by the catalogue number search. MusicBrainz is searched first, then Discogs
// when MusicBrainz has no matches.
export type ExternalRecordSearchResult = GetExternalRecordsResponse[number]

// Which source a release came from and its ID there, used to get its full details
export type ExternalRecordSource =
    | { source: 'musicBrainz'; musicBrainzId: string }
    | { source: 'discogs'; discogsId: number }

export const EXTERNAL_RECORD_SOURCE_NAMES: Record<ExternalRecordSource['source'], string> = {
    musicBrainz: 'MusicBrainz',
    discogs: 'Discogs',
}

export function getExternalRecordSource(release: ExternalRecordSource): ExternalRecordSource {
    return release.source === 'discogs'
        ? { source: 'discogs', discogsId: release.discogsId }
        : { source: 'musicBrainz', musicBrainzId: release.musicBrainzId }
}

// IDs are only unique within a source, so the source is part of the key
export function getExternalRecordKey(release: ExternalRecordSource): string {
    return release.source === 'discogs'
        ? `discogs-${release.discogsId}`
        : `musicBrainz-${release.musicBrainzId}`
}
