import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/localizacao/whatsapp-link",
        destination: "/utilidades/whatsapp-link",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
