import {
    Colour,
    Genre,
    MusicRecord,
    RecordFormat,
    ReleaseType,
} from '@awjh/home-automation-v2-api-models/records'

const MockRecord: MusicRecord = {
    id: '3f1c2b8e-5d4a-4c6b-9e7f-1a2b3c4d5e6f',
    title: 'Rumours',
    artists: ['Fleetwood Mac'],
    image: '/recipe.jpg',
    year: 1977,
    catNo: 'K 56344',
    format: RecordFormat.TWELVE_INCH,
    type: ReleaseType.ALBUM,
    labels: ['Warner Bros. Records'],
    sides: [
        {
            name: 'A',
            songs: [
                { title: 'Second Hand News', duration: 163 },
                { title: 'Dreams', duration: 254 },
                { title: 'Never Going Back Again', duration: 134 },
                { title: "Don't Stop", duration: 193 },
                { title: 'Go Your Own Way', duration: 218 },
                { title: 'Songbird', duration: 200 },
            ],
        },
        {
            name: 'B',
            songs: [
                { title: 'The Chain', duration: 270 },
                { title: 'You Make Loving Fun', duration: 211 },
                { title: "I Don't Want to Know", duration: 195 },
                { title: 'Oh Daddy', duration: 234 },
                { title: 'Gold Dust Woman', duration: 291 },
            ],
        },
    ],
    tags: {
        genres: [Genre.ROCK],
        colours: [Colour.BLACK],
    },
}

export default MockRecord
