/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mytwitter-dev-bucket.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // /a/ACg8ocJhEmbej-b3Hd-tU-eVMJIJqdly1d-I2XSh4Eu-iJB2bKFcdRw9=s96-c
    ],
  },
};

export default nextConfig;