describe('admin happy path', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
  })

  it('completes full admin flow', () => {
    
    // 1. visit homepage
    cy.visit('http://localhost:3000');
    // go to rego
    cy.get('[data-cy="nav-register"]').click();
    cy.wait(500);

    const name = 'Bob'
    const email = `test${Date.now()}@test.com`;
    const pass =  'Password123';
    cy.get('[data-cy="rego-name"]').type(name);
    cy.get('[data-cy="rego-email"]').type(email);
    cy.get('[data-cy="rego-pass"]').type(pass);
    cy.get('[data-cy="rego-pass-confirm"]').type(pass);
    cy.get('[data-cy="rego-submit"]').click();

    cy.contains('Dashboard').should('exist');

    // create new pres
    cy.get('[data-cy="new-presentation"]').click();
    cy.get('[data-cy="pres-name"]').type('My Deck');
    cy.get('[data-cy="pres-desc"]').type('Test Description');
    cy.get('[data-cy="pres-thumbnail"]').type('https://example.com/image.png');

    cy.get('[data-cy="pres-submit"]').click();
    cy.wait(500);
    cy.contains('My Deck').should('exist');

    // open pres
    cy.get('[data-cy^="presentation-"]').first().click();
    cy.wait(500);

    // edit thumbnail and name of pres
    cy.get('[data-cy="pres-edit-title"]').click();
    cy.get('[data-cy="edit-title-here"]').clear().type('My Updated Deck');
    cy.get('[data-cy="save-title-btn"]').click();
    cy.contains('My Updated Deck').should('exist');

    cy.get('[data-cy="pres-edit-thumbnail"]').click();
    cy.get('[data-cy="edit-thumb-here"]').clear().type('https://example.com/image2.png');
    cy.get('[data-cy="save-thumb-btn"]').click();
    cy.contains('My Updated Deck').should('exist');

    // add some slides
    cy.get('[data-cy="slide-number-indicator"]').should('contain', '1');
    cy.get('[data-cy="new-slide-btn"]').click(); 
    cy.wait(500); // Wait for transition/save
    cy.get('body').type('{leftArrow}');
    cy.get('[data-cy="slide-number-indicator"]').should('contain', '1');
    cy.get('body').type('{rightArrow}');
    cy.get('[data-cy="slide-number-indicator"]').should('contain', '2');


    // // delete pres
    cy.get('[data-cy="delete-pres-btn"]').click();
    cy.contains('Are you sure').should('exist');
    cy.contains('button', 'Yes').click();
    cy.url().should('include', '/dashboard');
    // log out
    cy.get('[data-cy="logout-button"]').click();

    // login
    cy.get('[data-cy="nav-login"]').should('exist');
    cy.get('[data-cy="nav-login"]').click();

    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-pass"]').type(pass);
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('Dashboard').should('exist');
  })
})