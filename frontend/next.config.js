/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['localhost', 'backend', 'image.tmdb.org'],
    },
}

module.exports = nextConfig
