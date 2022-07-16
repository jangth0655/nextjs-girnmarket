/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["imagedelivery.net"],
  },
  env: {
    CLOUD_ACCOUNT_ID: process.env.CLOUD_ACCOUNT_ID,
    CLOUD_API_TOKEN: process.env.CLOUD_API_TOKEN,
  },
  rewrites: async () => {
    return [
      {
        source: `/api/deleteFile/:imageId`,
        destination: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_ACCOUNT_ID}/images/v1/:imageId`,
        has: [
          {
            type: "header",
            key: "authorized",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
