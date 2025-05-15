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

describe('LikedBy e2e test', () => {
  const likedByPageUrl = '/liked-by';
  const likedByPageUrlPattern = new RegExp('/liked-by(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const likedBySample = {};

  let likedBy;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/liked-bies+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/liked-bies').as('postEntityRequest');
    cy.intercept('DELETE', '/api/liked-bies/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (likedBy) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/liked-bies/${likedBy.id}`,
      }).then(() => {
        likedBy = undefined;
      });
    }
  });

  it('LikedBies menu should load LikedBies page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('liked-by');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('LikedBy').should('exist');
    cy.url().should('match', likedByPageUrlPattern);
  });

  describe('LikedBy page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(likedByPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create LikedBy page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/liked-by/new$'));
        cy.getEntityCreateUpdateHeading('LikedBy');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedByPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/liked-bies',
          body: likedBySample,
        }).then(({ body }) => {
          likedBy = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/liked-bies+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [likedBy],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(likedByPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details LikedBy page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('likedBy');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedByPageUrlPattern);
      });

      it('edit button click should load edit LikedBy page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LikedBy');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedByPageUrlPattern);
      });

      it('edit button click should load edit LikedBy page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LikedBy');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedByPageUrlPattern);
      });

      it('last delete button click should delete instance of LikedBy', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('likedBy').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', likedByPageUrlPattern);

        likedBy = undefined;
      });
    });
  });

  describe('new LikedBy page', () => {
    beforeEach(() => {
      cy.visit(`${likedByPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('LikedBy');
    });

    it('should create an instance of LikedBy', () => {
      cy.get(`[data-cy="liked"]`).should('not.be.checked');
      cy.get(`[data-cy="liked"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        likedBy = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', likedByPageUrlPattern);
    });
  });
});
