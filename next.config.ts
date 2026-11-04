import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    reactCompiler: true,
    outputFileTracingIncludes: {
        '*': ['./src/generated/prisma/**/*'],
    },
    experimental: {
        useTypeScriptCli: true,
    },
}

// module.exports = {
//     allowedDevOrigins: [process.env.LOCAL_IP_ADDRESS],
// }

export default nextConfig
