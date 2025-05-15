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

describe('DietaryTags e2e test', () => {
  const dietaryTagsPageUrl = '/dietary-tags';
  const dietaryTagsPageUrlPattern = new RegExp('/dietary-tags(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const dietaryTagsSample = {};

  let dietaryTags;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/dietary-tags+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/dietary-tags').as('postEntityRequest');
    cy.intercept('DELETE', '/api/dietary-tags/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (dietaryTags) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/dietary-tags/${dietaryTags.id}`,
      }).then(() => {
        dietaryTags = undefined;
      });
    }
  });

  it('DietaryTags menu should load DietaryTags page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('dietary-tags');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('DietaryTags').should('exist');
    cy.url().should('match', dietaryTagsPageUrlPattern);
  });

  describe('DietaryTags page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(dietaryTagsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create DietaryTags page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/dietary-tags/new$'));
        cy.getEntityCreateUpdateHeading('DietaryTags');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dietaryTagsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/dietary-tags',
          body: dietaryTagsSample,
        }).then(({ body }) => {
          dietaryTags = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/dietary-tags+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [dietaryTags],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(dietaryTagsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details DietaryTags page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('dietaryTags');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dietaryTagsPageUrlPattern);
      });

      it('edit button click should load edit DietaryTags page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('DietaryTags');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dietaryTagsPageUrlPattern);
      });

      it('edit button click should load edit DietaryTags page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('DietaryTags');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dietaryTagsPageUrlPattern);
      });

      it('last delete button click should delete instance of DietaryTags', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('dietaryTags').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', dietaryTagsPageUrlPattern);

        dietaryTags = undefined;
      });
    });
  });

  describe('new DietaryTags page', () => {
    beforeEach(() => {
      cy.visit(`${dietaryTagsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('DietaryTags');
    });

    it('should create an instance of DietaryTags', () => {
      cy.get(`[data-cy="dietary"]`).type('Rhode granular Handmade').should('have.value', 'Rhode granular Handmade');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        dietaryTags = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', dietaryTagsPageUrlPattern);
    });
  });
});
