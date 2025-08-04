// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Add this block to fix the error
  transformIgnorePatterns: [
    '/node_modules/(?!(gsap|@gsap/react|@react-three/drei|three)/)',
  ],
};

export default createJestConfig(config);