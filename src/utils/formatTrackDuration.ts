// Formats a duration in seconds as mm:ss, e.g. 185 -> 03:05
export default function formatTrackDuration(duration: number): string {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
