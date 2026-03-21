/**
 * Storybook mock for @stytch/react.
 *
 * Vite resolves this module instead of the real SDK whenever Storybook builds,
 * because of the alias in .storybook/main.ts viteFinal config.
 *
 * Add any additional hooks / exports your components use as needed.
 */

import React from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

export interface StytchMockClient {
    parseAuthenticateUrl: () => { token: string } | null
    passwords: {
        resetByEmail: (args: unknown) => Promise<void>
        authenticate: (args: unknown) => Promise<void>
        create: (args: unknown) => Promise<void>
        strengthCheck: (args: unknown) => Promise<void>
    }
    oauth: {
        authenticate: (args: unknown) => Promise<void>
    }
    magicLinks: {
        email: {
            loginOrCreate: (args: unknown) => Promise<void>
        }
        authenticate: (args: unknown) => Promise<void>
    }
    session: {
        getSync: () => null
        revoke: () => Promise<void>
    }
    user: {
        getSync: () => null
    }
}

// ── Mock client ────────────────────────────────────────────────────────────

const mockClient: StytchMockClient = {
    parseAuthenticateUrl: () => ({ token: 'mock-token' }),
    passwords: {
        resetByEmail: async () => {},
        authenticate: async () => {},
        create: async () => {},
        strengthCheck: async () => {},
    },
    oauth: {
        authenticate: async () => {},
    },
    magicLinks: {
        email: {
            loginOrCreate: async () => {},
        },
        authenticate: async () => {},
    },
    session: {
        getSync: () => null,
        revoke: async () => {},
    },
    user: {
        getSync: () => null,
    },
}

// ── Context ────────────────────────────────────────────────────────────────

const StytchContext = React.createContext<StytchMockClient>(mockClient)

// ── StytchProvider ─────────────────────────────────────────────────────────

export function StytchProvider({ children }: { children: React.ReactNode; stytch?: unknown }) {
    return <StytchContext.Provider value={mockClient}>{children}</StytchContext.Provider>
}

// ── StytchClient (constructor stub) ───────────────────────────────────────

export class StytchClient {
    constructor(_publicToken: string) {}
}

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useStytch(): StytchMockClient {
    return React.useContext(StytchContext)
}

export function useStytchUser() {
    return { user: null, isInitialized: true }
}

export function useStytchSession() {
    return { session: null, isInitialized: true }
}

export function useStytchUIClient() {
    return mockClient
}
