// cypress/integration/auth_and_search.spec.js

// Este spec cubre tres escenarios: PIN válido, PIN inválido y embarque no encontrado.
describe('Flujo de autenticación y búsqueda de embarque', function() {
  beforeEach(function() {
    // Carga los datos de prueba y abre la URL con token
    cy.fixture('auth').then((authData) => {
      this.authData = authData;
      cy.visit(`/public/reports/shared?token=${authData.token}`);
    });
  });

  it('Autentica con PIN válido y busca embarque exitosamente', function() {
    cy.loginWithPin(this.authData.validPin);
    cy.url().should('include', '/dashboard');
    cy.searchShipment(this.authData.shipmentNumber);
    cy.get('[data-cy=shipment-detail]')
      .should('be.visible')
      .and('contain', this.authData.shipmentNumber);
  });

  it('Muestra error al usar PIN inválido', function() {
    cy.loginWithPin(this.authData.invalidPin);
    cy.get('[data-cy=error-message]')
      .should('be.visible')
      .and('contain', 'PIN inválido');
  });

  it('Muestra mensaje cuando embarque no existe', function() {
    cy.loginWithPin(this.authData.validPin);
    cy.searchShipment(this.authData.invalidShipment);
    cy.get('[data-cy=no-results]')
      .should('be.visible')
      .and('contain', 'No se encontró embarque');
  });
});
