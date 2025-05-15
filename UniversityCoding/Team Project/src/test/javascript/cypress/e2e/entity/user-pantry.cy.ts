import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('UserPantry e2e test', () => {
  const userPantryPageUrl = '/user-pantry';
  const userPantryPageUrlPattern = new RegExp('/user-pantry(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userPantrySample = {};

  let userPantry;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-pantries+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-pantries').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-pantries/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userPantry) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-pantries/${userPantry.id}`,
      }).then(() => {
        userPantry = undefined;
      });
    }
  });

  it('UserPantries menu should load UserPantries page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-pantry');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserPantry').should('exist');
    cy.url().should('match', userPantryPageUrlPattern);
  });

  describe('UserPantry page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userPantryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserPantry page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-pantry/new$'));
        cy.getEntityCreateUpdateHeading('UserPantry');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userPantryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-pantries',
          body: userPantrySample,
        }).then(({ body }) => {
          userPantry = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-pantries+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [userPantry],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userPantryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserPantry page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userPantry');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userPantryPageUrlPattern);
      });

      it('edit button click should load edit UserPantry page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserPantry');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userPantryPageUrlPattern);
      });

      it('edit button click should load edit UserPantry page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserPantry');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userPantryPageUrlPattern);
      });

      it('last delete button click should delete instance of UserPantry', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userPantry').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', userPantryPageUrlPattern);

        userPantry = undefined;
      });
    });
  });

  describe('new UserPantry page', () => {
    beforeEach(() => {
      cy.visit(`${userPantryPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserPantry');
    });

    it('should create an instance of UserPantry', () => {
      cy.get(`[data-cy="timestamp"]`).type('2023-03-20T03:43').blur().should('have.value', '2023-03-20T03:43');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        userPantry = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', userPantryPageUrlPattern);
    });
  });
});
