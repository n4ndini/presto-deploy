describe('Content Creator Path', () => {
  const email = `creator${Date.now()}@test.com`;
  const pass = 'Password123';

  it('tests slide editor features: text, code, and background', () => {
    // 1. Setup
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="nav-register"]').click();
    cy.get('[data-cy="rego-name"]').type('Creator Bob');
    cy.get('[data-cy="rego-email"]').type(email);
    cy.get('[data-cy="rego-pass"]').type(pass);
    cy.get('[data-cy="rego-pass-confirm"]').type(pass);
    cy.get('[data-cy="rego-submit"]').click();

    cy.get('[data-cy="new-presentation"]').click();
    cy.get('[data-cy="pres-name"]').type('Feature Test Deck');
    cy.get('[data-cy="pres-desc"]').type('Test Description');
    cy.get('[data-cy="pres-submit"]').click();
    cy.get('[data-cy^="presentation-"]').first().click();

    // 2. Add Text & Verify immediately on slide
    cy.contains('Edit Slide').click();
    cy.contains('+ Add Text').click();
    cy.get('[data-cy="text-input-field"]').type('Hello Cypress'); 
    cy.get('[data-cy="text-submit-btn"]').click(); 
    
    // Check that the text is rendered in the slide preview area
    cy.contains('Hello Cypress').should('be.visible');

    // 3. Add Code Block & Verify
    cy.contains('+ Add Code block').click();
    cy.get('[data-cy="code-input-field"]').type('console.log("Hello World")');
    cy.get('[data-cy="code-submit-btn"]').click();
    
    // Check for the <pre> tag or the code content
    cy.get('pre').should('contain', 'console.log');

    // 4. Test Background Change
    cy.get('[data-cy="change-bg-btn"]').click();
    cy.get('[data-cy="radio-solid"]').check(); 
    cy.get('[data-cy="bg-color-input"]').clear().type('#ff0000');
    cy.get('[data-cy="apply-bg-curr"]').click();

    // Verify background color was applied to the slide container
    // Assuming your slide has a class or specific style you can target
    cy.wait(1200);
    cy.get('div[class*="slideFade"]')
      .should('have.css', 'background-color')
      .and('include', 'rgb(255, 0, 0)');
  });
});