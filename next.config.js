/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'cdn.anonymousceviri.com',
            },
            {
                protocol: 'https',
                hostname: 'api.anonymousceviri.com',
            },
            {
                protocol: 'https',
                hostname: 'photos.anonymousceviri.com',
            },
            {
                protocol: 'https',
                hostname: 'shared.fastly.steamstatic.com',
            },
        ],
    },
    async rewrites() {
        // Login/Register → Route Handler (IP forwarding + Content-Length)
        // Diğer tüm istekler (/auth/me, /auth/sitekey, /games, vb.) → rewrite proxy
        return {
            beforeFiles: [],
            afterFiles: [],
            fallback: [
                {
                    source: '/api/website/:path*',
                    destination: 'https://api.anonymousceviri.com/api/website/:path*',
                },
            ],
        };
    },
}

module.exports = nextConfig
