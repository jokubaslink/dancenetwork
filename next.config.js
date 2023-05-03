/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com']
  },
  i18n: {
    localeDetection: false,
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
}

module.exports = nextConfig
