import type { Metadata } from 'next'
import BellboardsScreen from '@screens/BellboardsScreen/BellboardsScreen'
import { getBellboards, ringBellboard } from './actions'

export const metadata: Metadata = {
    title: 'Bellboards',
}

export default async function Bellboards() {
    const bellboards = await getBellboards()

    return <BellboardsScreen bellboards={bellboards} ringBellboard={ringBellboard} />
}
