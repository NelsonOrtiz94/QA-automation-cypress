// cypress/support/commands.js

// Comando para autenticar con un PIN dado
Cypress.Commands.add("loginWithPin", (pin) => {
  // 1. Espera a que el primer dígito esté visible (hasta 10 s)
  cy.get('input[id="digit1"]', { timeout: 10000 }).should("be.visible");

  // 2. Rellena cada dígito en su input correspondiente
  pin.split("").forEach((digit, index) => {
    cy.get(`input[id="digit${index + 1}"]`, { timeout: 10000 })
      .clear()
      .type(digit);
  });

  // 3. Haz clic en “Ingresar”
  cy.get('button[type="submit"]', { timeout: 10000 })
    .should("be.enabled")
    .click();
});

Cypress.Commands.add("searchShipment", (shipmentNumber) => {
  // 0. Abrir el panel de filtros
  cy.contains("Filtros", { timeout: 10000 }).click();

  // 1. Buscar directamente el .select-btn que contiene “Seleccionar” y click
  cy.get(".select-btn", { timeout: 10000 })
    .contains("Seleccionar")
    .should("be.visible")
    .click();

  // 2. Elegir “Embarque” del dropdown
  cy.contains("p", "Embarque").click({ force: true });

  // 3. Teclear el número de embarque en el input principal y enviar con Enter
  cy.get('input[placeholder="Escribe aquí tu búsqueda"]', { timeout: 10000 })
    .should("be.visible")
    .clear()
    .type(shipmentNumber + "{enter}");
});
