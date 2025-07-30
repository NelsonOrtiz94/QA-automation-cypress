// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Solo el dominio o subdominio donde vive tu APP
    baseUrl: 'https://www.selaski.com',
    fixturesFolder: 'cypress/fixtures',
    supportFile: 'cypress/support/commands.js',
    specPattern: 'cypress/integration/**/*.js',
    video: true,
    screenshotOnRunFailure: true
  }
})
