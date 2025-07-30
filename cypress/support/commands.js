// cypress/support/commands.js

// Comando para autenticar con un PIN dado
Cypress.Commands.add('loginWithPin', (pin) => {
  // 1. Espera a que el primer dígito esté visible (hasta 10 s)
  cy.get('input[id="digit1"]', { timeout: 10000 })
    .should('be.visible');

  // 2. Rellena cada dígito en su input correspondiente
  pin.split('').forEach((digit, index) => {
    cy.get(`input[id="digit${index + 1}"]`, { timeout: 10000 })
      .clear()
      .type(digit);
  });

  // 3. Haz clic en “Ingresar” (ajusta si tu botón usa otro selector)
  cy.get('button[type="submit"]', { timeout: 10000 })
    .should('be.enabled')
    .click();
});

// Comando para buscar un embarque por número
Cypress.Commands.add('searchShipment', (shipmentNumber) => {
  cy.get('[data-cy=filter-button]').click();
  cy.get('[data-cy=filter-select]').select('Embarque');
  cy.get('[data-cy=shipment-input]')
    .clear()
    .type(shipmentNumber);
  cy.get('[data-cy=shipment-submit]').click();
});
