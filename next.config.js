const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), '@prisma/client', '.prisma/client'];
    }
    return config;
  },
}

module.exports = nextConfig
