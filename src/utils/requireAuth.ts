import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Client } from 'stytch'

export const stytchClient = new Client({
    project_id: process.env.STYTCH_PROJECT_ID!,
    secret: process.env.STYTCH_SECRET!,
})

export async function requireAuth() {
    const jwt = (await cookies()).get('stytch_session_jwt')?.value

    if (!jwt) {
        redirect('/login')
    }

    try {
        const session = await stytchClient.sessions.authenticateJwt({
            session_jwt: jwt,
        })

        return session
    } catch {
        redirect('/login')
    }
}
