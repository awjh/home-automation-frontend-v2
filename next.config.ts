import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // Unique per deploy so clients still running an old build hard-reload instead of
    // calling Server Action IDs the new server no longer recognises
    deploymentId: process.env.NEXT_DEPLOYMENT_ID,
    experimental: {
        optimizePackageImports: ['@chakra-ui/react'],
    },
}

export default nextConfig
