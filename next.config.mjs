/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DB_URL: process.env.DB_URL,
    DB_TOKEN: process.env.DB_TOKEN,
  },
};

export default nextConfig;
