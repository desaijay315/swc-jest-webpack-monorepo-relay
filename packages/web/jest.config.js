const pkg = require('./package.json');

var swcConfig = {
  jsc: {
    experimental: {
      plugins: [
        [
          "@swc/plugin-relay",
          {
            language: "typescript",
            schema: "../server/graphql/schema.graphql",
            rootDir: __dirname,
            src: "./src",
            artifactDirectory: "src/__generated__",
          },
        ],
      ],
    },
    parser: {
      decorators: true,
      dynamicImport: true,
      syntax: "typescript",
      tsx: true,
    },
    transform: {
      react: {
        runtime: "automatic",
      },
    },
  },
}
module.exports = {
  name: pkg.name,
  displayName: pkg.name,
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(j|t)sx?$',
  testPathIgnorePatterns: ['/node_modules/', './dist', '__generated__'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.js'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/tests$': '<rootDir>/test/test-utils.tsx',
    '^@/(.*)': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  transform: {
    '^.+\\.(js|ts|tsx)?$': ['@swc/jest', swcConfig],
    "\\.(gql|graphql)$": "@graphql-tools/jest-transform",
  },
};
