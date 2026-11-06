import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // project images are uploaded to Cloudinary from the admin workspace
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
