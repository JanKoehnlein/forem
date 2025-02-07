describe('User Update Settings Profile', () => {
  beforeEach(() => {
    cy.testSetup();
    cy.fixture('users/articleEditorV1User.json').as('user');

    cy.get('@user').then((user) => {
      cy.loginUser(user).then(() => {
        cy.visit('/settings/profile');
      });
    });
  });

  it('should change Basic profile settings', () => {
    const websiteURL = 'https://example.com';
    const summary = 'This is my story...';
    const location = 'New York City';

    cy.findByLabelText(/^Website URL$/i).type(websiteURL);
    cy.findByLabelText(/^Summary$/i).type(summary);
    cy.findByLabelText(/^Location$/i).type(location);

    cy.findByText(/^Save Profile Information$/i).click();

    const { baseUrl } = Cypress.config();
    cy.url().should('equal', `${baseUrl}settings`);

    cy.findByText('Your profile has been updated').should('be.visible');

    cy.findByRole('textbox', { name: 'Website URL' }).should(
      'have.value',
      websiteURL,
    );
    cy.findByRole('textbox', { name: 'Summary' }).should('have.value', summary);
    cy.findByRole('textbox', { name: 'Location' }).should(
      'have.value',
      location,
    );
  });
});
