import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    env: {
      // Add environment variables for testing
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_cHJlY2lzZS1yYXB0b3ItOTcuY2xlcmsuYWNjb3VudHMuZGV2JA',
      NEXT_PUBLIC_CONVEX_URL: 'https://quixotic-clownfish-341.convex.cloud',
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
}) 