import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */

  experimental: {
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://172.20.10.9:3000",
      // ถ้าคุณเปิดผ่านโดเมนใน LAN ก็ใส่เพิ่ม:
      // "http://your-domain-or-ip:3000",
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "img.pikbest.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
        {
        protocol: "https",
        hostname: "d1csarkz8obe9u.cloudfront.net",
      },
    ],
  },
} as NextConfig;

export default nextConfig;
