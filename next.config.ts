/** @type {import('next').NextConfig} */
const nextConfig = {
  // libera todas as origens em dev
  allowedDevOrigins: ["*"],

  async rewrites() {
    return [
      {
        // só proxya chamadas à API
        source: "/api/:path*",
        destination: "http://localhost:3000/:path*", // sua API Nest
      },
    ];
  },
};

module.exports = nextConfig;
