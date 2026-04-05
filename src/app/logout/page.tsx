import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { stytchClient } from '@utils/requireAuth'

export default async function LogoutPage() {
    const cookieStore = await cookies()
    const sessionJwt = cookieStore.get('stytch_session_jwt')?.value

    if (sessionJwt) {
        try {
            await stytchClient.sessions.revoke({
                session_jwt: sessionJwt,
            })
        } catch {
            // Ignore revoke failures so we can still clear the cookie and redirect.
        }

        cookieStore.delete('stytch_session_jwt')
    }

    redirect('/login')
}
