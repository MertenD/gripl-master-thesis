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
                destination: 'http://localhost:8080/:path*',
            },
        ];
    },
};

export default nextConfig;
