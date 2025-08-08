import type { NextConfig } from "next";

const withTM = require('next-transpile-modules')(['three'])
module.exports = withTM()

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['three'],
  
  output: 'standalone',
  

};

export default nextConfig;
