/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.NODE_ENV === 'development' && 'http://localhost:3000' ||
      process.env.NODE_ENV === 'production' && process.env.PRODUCTION_URL,
    MONGODB_URI: process.env.MONGODB_URI,
  }
};

module.exports = nextConfig;
