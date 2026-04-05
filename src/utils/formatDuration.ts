export default function formatDuration(duration: number): string {
    if (duration < 60) {
        return `${duration}m`
    }

    const minutes = duration % 60
    const hours = (duration - minutes) / 60

    if (minutes === 0) {
        return `${hours}h`
    }

    return `${hours}h ${minutes}m`
}
