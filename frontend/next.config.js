/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['flixora.uk', 'backend', 'image.tmdb.org'],
    },
}

module.exports = nextConfig
