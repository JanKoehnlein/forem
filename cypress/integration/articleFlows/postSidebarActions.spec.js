describe('Post sidebar actions', () => {
  beforeEach(() => {
    cy.testSetup();
    cy.fixture('users/articleEditorV2User.json').as('user');

    cy.get('@user').then((user) => {
      cy.loginUser(user).then(() => {
        cy.createArticle({
          title: 'Test Article',
          tags: ['beginner', 'ruby', 'go'],
          content: `This is a test article's contents.`,
          published: true,
        }).then((response) => {
          cy.visit(response.body.current_state_path);
        });
      });
    });
  });

  it('should open and close the share menu for the post', () => {
    // Check dropdown is closed by asserting the first option isn't visible
    cy.findByRole('img', {
      name: /^Copy article link to the clipboard$/i,
    }).should('not.exist');

    cy.findByRole('button', { name: /^Share post options$/i }).as(
      'dropdownButton',
    );
    cy.get('@dropdownButton').click();

    cy.findByLabelText('Post URL').should('have.focus');
    cy.findByRole('img', {
      name: /^Copy article link to the clipboard$/i,
    });
    cy.findByRole('link', { name: /^Share to Twitter$/i });
    cy.findByRole('link', { name: /^Share to LinkedIn$/i });
    cy.findByRole('link', { name: /^Share to Reddit$/i });
    cy.findByRole('link', { name: /^Share to Hacker News$/i });
    cy.findByRole('link', { name: /^Share to Facebook$/i });
    // There is a report abuse link at the bottom of the post too
    cy.findAllByRole('link', { name: /^Report Abuse$/i }).should(
      'have.length',
      2,
    );

    cy.get('@dropdownButton').click();

    // Check dropdown is closed by asserting the first option isn't visible
    cy.findByRole('img', {
      name: /^Copy article link to the clipboard$/i,
    }).should('not.exist');
  });

  it('should close the options dropdown on Escape press, returning focus', () => {
    cy.findByRole('button', { name: /^Share post options$/i }).as(
      'dropdownButton',
    );
    cy.get('@dropdownButton').click();

    cy.findByLabelText('Post URL').should('have.focus');
    cy.get('body').type('{esc}');
    cy.findByLabelText('Post URL').should('not.be.visible');
    cy.get('@dropdownButton').should('have.focus');
  });

  it('should display clipboard copy announcer until the dropdown is next closed', () => {
    cy.findByRole('button', { name: /^Share post options$/i }).as(
      'dropdownButton',
    );
    cy.get('@dropdownButton').click();

    cy.findByText('Copied to Clipboard').should('not.be.visible');
    cy.findByRole('img', {
      name: /^Copy article link to the clipboard$/i,
    }).click();
    cy.findByText('Copied to Clipboard').should('be.visible');

    // Close the dropdown, and reopen it to check the message has disappeared
    cy.get('@dropdownButton').click();
    cy.get('@dropdownButton').click();
    cy.findByText('Copied to Clipboard').should('not.be.visible');
  });
});
