// Parses a duration typed as mm:ss (e.g. 3:05 or 03:05) into seconds, or undefined if invalid
export default function parseTrackDuration(value: string): number | undefined {
    const match = value.trim().match(/^(\d+):([0-5]\d)$/)

    if (!match) {
        return undefined
    }

    return Number(match[1]) * 60 + Number(match[2])
}
