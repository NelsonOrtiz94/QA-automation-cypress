
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

    // Filtrado y búsqueda
    cy.searchShipment(this.authData.shipmentNumber);

    // Valida al menos una fila real y que contenga el código buscado
    cy.get('div.table-first-element', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
      .first()
      .find('p')
      .should('contain.text', this.authData.shipmentNumber);
  });

  it('2) No avanza con PIN inválido (HTTP 403) y permanece en el formulario', function() {
    // Intercepta la llamada de login para validar el status
    cy.intercept('POST', '**/api/v2/auth/loginPublic').as('badLogin');
    cy.loginWithPin(this.authData.invalidPin);
    cy.wait('@badLogin').its('response.statusCode').should('eq', 403);

    // Verifica que el formulario de PIN sigue visible
    cy.get('input[id="digit1"]', { timeout: 10000 }).should('be.visible');
  });

  it('3) Muestra chip y cero resultados al buscar embarque no existente', function() {
    cy.loginWithPin(this.authData.validPin);
    cy.searchShipment(this.authData.invalidShipment);

    // Codigo “Embarque: 1111”
    cy.contains(`Embarque: ${this.authData.invalidShipment}`, { timeout: 10000 })
      .should('be.visible');

    // Valida que no debe haber filas de resultados
    cy.get('div.table-first-element').should('have.length', 0);
  });
});
