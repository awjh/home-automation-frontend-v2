import { GetBellboardsResponse } from '@awjh/home-automation-v2-api-models'

const MockBellboards: GetBellboardsResponse = [
    {
        bellboardName: 'Main House',
        rooms: [
            'Drawing Room',
            'Library',
            'Dining Room',
            'Morning Room',
            'Study',
            'Master Bedroom',
        ],
        version: '1.2.0',
        lastUpdated: '2026-10-23T09:00:00Z',
    },
    {
        bellboardName: 'Servants Hall',
        rooms: ['Kitchen', 'Scullery', 'Pantry'],
        version: '1.1.4',
        lastUpdated: '2026-10-22T18:30:00Z',
    },
]

export default MockBellboards
