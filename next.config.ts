/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "192.168.100.11", // seu IP local
  ],

  async rewrites() {
    return [
      {
        source: "/:path*", // captura qualquer rota (exceto assets do Next)
        destination: "http://192.168.100.11:3000/:path*", // API Nest
      },
    ];
  },
};

module.exports = nextConfig;
