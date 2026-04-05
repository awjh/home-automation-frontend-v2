import { requireAuth } from '@utils/requireAuth'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    await requireAuth()

    return children
}
