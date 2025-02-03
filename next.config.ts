import type { NextConfig } from "next"
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://mirrorc.top/api/:path*', // 这里替换成你的 API 服务器地址
      },
    ]
  },
  experimental: {
    reactCompiler: true,
  },
}

export default withNextIntl(nextConfig)
