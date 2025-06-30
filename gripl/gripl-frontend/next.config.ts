import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack(config, { isServer }) {
        config.module.rules.push({
            test: /\.bpmn$/,
            use: 'raw-loader'
        });

        return config;
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.API_BASE_URL}/:path*`,
            },
        ];
    },
    images: {
        remotePatterns: [{
            protocol: process.env.API_BASE_URL?.startsWith('https') ? 'https' : 'http',
            hostname: process.env.API_BASE_URL?.replace(/^https?:\/\//, '').split(':')[0] || 'localhost',
            port: process.env.API_BASE_URL?.includes(':8080') ? '8080' : '',
            pathname: '/**',
        }]
    }
};

export default nextConfig;
