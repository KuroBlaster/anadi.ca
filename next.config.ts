import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app"],
  async redirects() {
    return [
      {
        source: "/field-notes",
        destination: "/writing",
        permanent: true,
      },
      {
        source: "/field-notes/:slug",
        destination: "/writing/:slug",
        permanent: true,
      },
      {
        source: "/mythos",
        destination: "/writing",
        permanent: true,
      },
      {
        source: "/mythos/:slug",
        destination: "/writing/:slug",
        permanent: true,
      },
      {
        source: "/works",
        destination: "/writing",
        permanent: true,
      },
      {
        source: "/works/:slug",
        destination: "/writing/:slug",
        permanent: true,
      },
      {
        source: "/selected-work",
        destination: "/creative-systems",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
