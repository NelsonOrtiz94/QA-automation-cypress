const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.selaski.com',
    fixturesFolder: 'cypress/fixtures',
    supportFile: 'cypress/support/commands.js',
    specPattern: 'cypress/integration/**/*.js',
    video: true,
    screenshotOnRunFailure: true
  }
})
