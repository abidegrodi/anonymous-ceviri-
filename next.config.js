/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
                    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
                ],
            },
        ];
    },
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
