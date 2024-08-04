import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true, 
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization.minimizer.push(new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: true, 
                    },
                },
            }));
        }
        return config;
    },
};

export default nextConfig;
