# Automatización de Pruebas con Cypress

Este repositorio contiene la prueba técnica de QA Automation para Selaski, implementada con Cypress. La suite cubre el flujo de autenticación con PIN, filtrado de embarque y validación de datos.


## Estructura del Proyecto

```
├── cypress/
│ ├── fixtures/
│ │ └── auth.json
│ ├── integration/
│ │ └── auth_and_search.spec.js
│ └── support/
│ └── commands.js
├── cypress.config.js
├── package.json
└── README.md
```
- **cypress/fixtures/auth.json**  
    Datos de prueba (PINs, tokens y números de embarque).
- **cypress/integration/auth_and_search.spec.js**  
    Specs que cubren los tres escenarios principales.
- **cypress/support/commands.js**  
    Comandos personalizados: `loginWithPin` y `searchShipment`.
- **cypress.config.js**  
    Configuración de Cypress (baseUrl, fixturesFolder, video, etc.).
- **package.json**  
    Dependencias y scripts de ejecución.

## Prerrequisitos

- **Node.js** ≥ 14  
- **npm** (incluido con Node.js)  
- Conexión a internet para acceder a `https://www.selaski.com`

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/qa-selaski.git
   cd qa-selaski

2. Instala dependencias:
   ```bash
   npm install

## Configuración

### 1. cypress.config.js
   ```
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
  ```
- **baseUrl: dominio de la aplicación bajo prueba.**

- **video: habilita la grabación automática en cypress/videos.**

- **screenshotOnRunFailure: captura pantalla al fallar un test en cypress/screenshots.**

### 2. Fixtures (cypress/fixtures/auth.json)
   ```bash
   {
    "validPin": "CREDENCIAL ASIGNADA",
    "invalidPin": "1234",
    "shipmentNumber": "CRT23400401-03",
    "invalidShipment": "1111",
    "token": "CREDENCIAL ASIGNADA"
    }
  ```
- **validPin / invalidPin: PINs para pruebas.**

- **shipmentNumber: número de embarque válido a buscar.**

- **invalidShipment: código que no existe (asegura “0 resultados”).**

- **token: token público para acceder al reporte compartido.**

### 3. Comandos personalizados (cypress/support/commands.js)

  ```
// Login con PIN de 4 dígitos
Cypress.Commands.add("loginWithPin", (pin) => {
  cy.get('input[id="digit1"]', { timeout: 10000 }).should("be.visible");
  pin.split("").forEach((digit, i) => {
    cy.get(`input[id="digit${i + 1}"]`, { timeout: 10000 })
      .clear()
      .type(digit);
  });
  cy.get('button[type="submit"]', { timeout: 10000 })
    .should("be.enabled")
    .click();
});

// Filtrado de embarque
Cypress.Commands.add("searchShipment", (shipmentNumber) => {
  cy.contains("Filtros", { timeout: 10000 }).click();
  cy.get(".select-btn", { timeout: 10000 })
    .contains("Seleccionar")
    .click();
  cy.contains("Embarque", { timeout: 10000 }).click();
  cy.get('input[placeholder="Escribe aquí tu búsqueda"]', { timeout: 10000 })
    .clear()
    .type(shipmentNumber);
  cy.contains(`Embarque: ${shipmentNumber}`, { timeout: 10000 })
    .should("be.visible");
});
```

##  Escenarios de Prueba

### 1.Autenticación válida + búsqueda de embarque

- **Ingreso de PIN ASIGNADO.**

- **Filtrado por “Embarque” y búsqueda de shipmentNumber.**

- **Validación de que aparece al menos un resultado con el código.**

### 2.PIN inválido

- **Intento de login con PIN 1234.**

- **Verificación de que la petición de login retorna 403 y el formulario de PIN permanece.**

### 3.Búsqueda de embarque inexistente

- **Login válido.**

- **Filtrado con invalidShipment (1111).**

- **Verificación de que aparece el chip con invalidShipment y 0 resultados.**


# Cómo Ejecutar

### Modo Interactivo (IDE de Cypress)
```
  npm run cypress:open
```

- **Selecciona tu spec `auth_and_search.spec.js`.**

- **Observa la ejecución paso a paso en el navegador.**

# Modo Headless (CI / Terminal)

```
  npm test
  # equivalente a: npx cypress run
```
