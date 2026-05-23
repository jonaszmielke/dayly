import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
}

module.exports = {
    allowedDevOrigins: [process.env.LOCAL_IP_ADDRESS],
}

export default nextConfig
