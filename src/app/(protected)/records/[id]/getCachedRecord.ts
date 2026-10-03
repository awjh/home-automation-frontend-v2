import { cache } from 'react'
import { getRecord } from './actions'

// Shares the record fetch between generateMetadata and the page within a single request
const getCachedRecord = cache(getRecord)

export default getCachedRecord
