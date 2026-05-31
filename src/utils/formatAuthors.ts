export default function formatAuthors(authors: string[]) {
    if (authors.length <= 1) {
        return authors[0] ?? ''
    }

    if (authors.length === 2) {
        return authors.join(' & ')
    }

    return `${authors.slice(0, -1).join(', ')} & ${authors.at(-1)}`
}
