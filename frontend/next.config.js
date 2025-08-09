/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    swcMinify: true,
    images: {
        domains: ['localhost', 'backend', 'image.tmdb.org', 'randomuser.me'],
    },
    experimental: {
        outputFileTracingRoot: __dirname,
    },
    webpackDevMiddleware: config => { // for hot reloading becuse we use docker
        config.watchOptions = {
            poll: 1000, // Check for changes every second
            aggregateTimeout: 300, // Delay before rebuilding
        }
        return config
    },
    // Add this if needed:
    // server: {
    //   port: 3000,
    // },
}

module.exports = nextConfig
