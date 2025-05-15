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

describe('Allergens e2e test', () => {
  const allergensPageUrl = '/allergens';
  const allergensPageUrlPattern = new RegExp('/allergens(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const allergensSample = {};

  let allergens;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/allergens+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/allergens').as('postEntityRequest');
    cy.intercept('DELETE', '/api/allergens/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (allergens) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/allergens/${allergens.id}`,
      }).then(() => {
        allergens = undefined;
      });
    }
  });

  it('Allergens menu should load Allergens page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('allergens');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Allergens').should('exist');
    cy.url().should('match', allergensPageUrlPattern);
  });

  describe('Allergens page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(allergensPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Allergens page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/allergens/new$'));
        cy.getEntityCreateUpdateHeading('Allergens');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', allergensPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/allergens',
          body: allergensSample,
        }).then(({ body }) => {
          allergens = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/allergens+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [allergens],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(allergensPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Allergens page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('allergens');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', allergensPageUrlPattern);
      });

      it('edit button click should load edit Allergens page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Allergens');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', allergensPageUrlPattern);
      });

      it('edit button click should load edit Allergens page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Allergens');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', allergensPageUrlPattern);
      });

      it('last delete button click should delete instance of Allergens', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('allergens').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', allergensPageUrlPattern);

        allergens = undefined;
      });
    });
  });

  describe('new Allergens page', () => {
    beforeEach(() => {
      cy.visit(`${allergensPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Allergens');
    });

    it('should create an instance of Allergens', () => {
      cy.get(`[data-cy="celery"]`).should('not.be.checked');
      cy.get(`[data-cy="celery"]`).click().should('be.checked');

      cy.get(`[data-cy="gluten"]`).should('not.be.checked');
      cy.get(`[data-cy="gluten"]`).click().should('be.checked');

      cy.get(`[data-cy="crustaceans"]`).should('not.be.checked');
      cy.get(`[data-cy="crustaceans"]`).click().should('be.checked');

      cy.get(`[data-cy="egg"]`).should('not.be.checked');
      cy.get(`[data-cy="egg"]`).click().should('be.checked');

      cy.get(`[data-cy="fish"]`).should('not.be.checked');
      cy.get(`[data-cy="fish"]`).click().should('be.checked');

      cy.get(`[data-cy="lupin"]`).should('not.be.checked');
      cy.get(`[data-cy="lupin"]`).click().should('be.checked');

      cy.get(`[data-cy="milk"]`).should('not.be.checked');
      cy.get(`[data-cy="milk"]`).click().should('be.checked');

      cy.get(`[data-cy="molluscs"]`).should('not.be.checked');
      cy.get(`[data-cy="molluscs"]`).click().should('be.checked');

      cy.get(`[data-cy="mustard"]`).should('not.be.checked');
      cy.get(`[data-cy="mustard"]`).click().should('be.checked');

      cy.get(`[data-cy="nuts"]`).should('not.be.checked');
      cy.get(`[data-cy="nuts"]`).click().should('be.checked');

      cy.get(`[data-cy="peanuts"]`).should('not.be.checked');
      cy.get(`[data-cy="peanuts"]`).click().should('be.checked');

      cy.get(`[data-cy="sesame"]`).should('not.be.checked');
      cy.get(`[data-cy="sesame"]`).click().should('be.checked');

      cy.get(`[data-cy="soya"]`).should('not.be.checked');
      cy.get(`[data-cy="soya"]`).click().should('be.checked');

      cy.get(`[data-cy="sulphur"]`).should('not.be.checked');
      cy.get(`[data-cy="sulphur"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        allergens = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', allergensPageUrlPattern);
    });
  });
});
