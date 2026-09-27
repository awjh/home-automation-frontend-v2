// Runtime env vars read by the Next.js server code (see src/utils/requireAuth.ts and
// src/app/(protected)/shared/getEndpoint.ts)
type ServerFunctionEnvVars = {
    API_BASE_URL: string
    API_KEY: string
    STYTCH_PROJECT_ID: string
    STYTCH_SECRET: string
}

export default ServerFunctionEnvVars
