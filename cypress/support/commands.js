// Comando para autenticar con un PIN dado
Cypress.Commands.add("loginWithPin", (pin) => {
  // Espera a que el primer dígito esté visible (hasta 10 s)
  cy.get('input[id="digit1"]', { timeout: 10000 }).should("be.visible");

  // Rellena cada dígito en su input correspondiente
  pin.split("").forEach((digit, index) => {
    cy.get(`input[id="digit${index + 1}"]`, { timeout: 10000 })
      .clear()
      .type(digit);
  });

  // Hace clic en “Ingresar”
  cy.get('button[type="submit"]', { timeout: 10000 })
    .should("be.enabled")
    .click();
});

Cypress.Commands.add("searchShipment", (shipmentNumber) => {
  // Abrir el panel de filtros
  cy.contains("Filtros", { timeout: 10000 }).click();

  // Busca directamente el .select-btn que contiene “Seleccionar” y click
  cy.get(".select-btn", { timeout: 10000 })
    .contains("Seleccionar")
    .should("be.visible")
    .click();

  // 2. Elije “Embarque” del dropdown
  cy.contains("p", "Embarque").click({ force: true });

  // 3. Teclea el número de embarque en el input principal y enviar con Enter
  cy.get('input[placeholder="Escribe aquí tu búsqueda"]', { timeout: 10000 })
    .should("be.visible")
    .clear()
    .type(shipmentNumber + "{enter}");
});
