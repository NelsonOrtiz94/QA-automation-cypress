// // cypress/integration/auth_and_search.spec.js

// describe('Flujo de autenticación y búsqueda de embarque', function() {
//   beforeEach(function() {
//     // 1. Cargo el fixture y veo la URL con token
//     cy.fixture('auth').then(auth => {
//       this.authData = auth;
//       cy.visit(`/public/reports/shared?token=${auth.token}`);
//     });
//   });

//   it('Autentica con PIN válido y encuentra resultados', function() {
//     cy.loginWithPin(this.authData.validPin);

//     // Espero a que aparezca el input de búsqueda
//     cy.get('input[placeholder="Escribe aquí tu búsqueda"]', { timeout: 10000 })
//       .should('be.visible');

//     cy.searchShipment(this.authData.shipmentNumber);

//     // Debe aparecer al menos una fila en la tabla de resultados
//     cy.get('table tbody tr')
//       .should('have.length.greaterThan', 0);

//     // Y debe contener el número de embarque buscado
//     cy.contains(this.authData.shipmentNumber)
//       .should('be.visible');
//   });

//   it('Muestra error al usar PIN inválido', function() {
//     cy.loginWithPin(this.authData.invalidPin);

//     // Valida que aparezca el mensaje de PIN inválido
//     cy.contains('PIN inválido', { timeout: 10000 })
//       .should('be.visible');
//   });

//   it('Muestra un chip y cero resultados cuando el embarque no existe', function() {
//     cy.loginWithPin(this.authData.validPin);
//     cy.searchShipment(this.authData.invalidShipment);

//     // Debe mostrarse el chip "Embarque: 0000"
//     cy.contains(`Embarque: ${this.authData.invalidShipment}`, { timeout: 10000 })
//       .should('be.visible');

//     // Y la tabla de resultados debe venir vacía
//     cy.get('table tbody tr')
//       .should('have.length', 0);
//   });
// });

// cypress/integration/auth_and_search.spec.js

describe('Flujo de autenticación y búsqueda de embarque', function() {
  beforeEach(function() {
    cy.fixture('auth').then(auth => {
      this.authData = auth;
      cy.visit(`/public/reports/shared?token=${auth.token}`);
    });
  });

  it('1) Autentica con PIN válido y valida el filtro de embarque', function() {
    // Login con PIN válido
    cy.loginWithPin(this.authData.validPin);

    // Filtrado y búsqueda (usa tu comando custom)
    cy.searchShipment(this.authData.shipmentNumber);

    // Validación de resultados: al menos una fila y contiene el código buscado
    cy.get('table tbody tr', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
      .first()
      .contains(this.authData.shipmentNumber)
      .should('be.visible');
  });

  it('2) No avanza con PIN inválido (HTTP 403) y permanece en el formulario', function() {
    // Interceptamos la llamada de login para validar el status
    cy.intercept('POST', '**/api/v2/auth/loginPublic').as('badLogin');
    cy.loginWithPin(this.authData.invalidPin);
    cy.wait('@badLogin').its('response.statusCode').should('eq', 403);

    // Verificar que el formulario de PIN sigue visible
    cy.get('input[id="digit1"]', { timeout: 10000 }).should('be.visible');
  });

  it('3) Muestra chip y cero resultados al buscar embarque no existente', function() {
    cy.loginWithPin(this.authData.validPin);
    cy.searchShipment(this.authData.invalidShipment);

    // Chip “Embarque: 0000”
    cy.contains(`Embarque: ${this.authData.invalidShipment}`, { timeout: 10000 })
      .should('be.visible');

    // Tabla vacía
    cy.get('table tbody tr').should('have.length', 0);
  });
});
