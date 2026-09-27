import { requireAuth } from '@utils/requireAuth'

// Every protected route depends on the session cookie, so skip the static prerender attempt
export const dynamic = 'force-dynamic'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    await requireAuth()

    return children
}
