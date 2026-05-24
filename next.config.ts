import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    reactCompiler: true,
    outputFileTracingIncludes: {
        '*': ['./node_modules/.prisma/client/**/*', './node_modules/@prisma/client/**/*'],
    },
}

// module.exports = {
//     allowedDevOrigins: [process.env.LOCAL_IP_ADDRESS],
// }

export default nextConfig
