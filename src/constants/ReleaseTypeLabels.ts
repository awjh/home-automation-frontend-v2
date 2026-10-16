import { ReleaseType } from '@awjh/home-automation-v2-api-models/records'

const RELEASE_TYPE_LABELS: Record<ReleaseType, string> = {
    [ReleaseType.ALBUM]: 'Album',
    [ReleaseType.EP]: 'EP',
    [ReleaseType.SINGLE]: 'Single',
    [ReleaseType.NON_MUSIC]: 'Non-Music',
}

export default RELEASE_TYPE_LABELS
