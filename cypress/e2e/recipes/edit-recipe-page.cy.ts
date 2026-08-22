import { GetRecipeResponse } from '@awjh/home-automation-v2-api-models'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { buildBookRecipe } from './recipeBuilders/buildRecipe'

describe('edit recipe page', () => {
    const createdRecipeIds: string[] = []

    const clickWizardNext = () => {
        cy.contains('button', /^next$/i).click()
    }

    const EDIT_RECIPE_FETCH_RETRIES = 10
    const EDIT_RECIPE_FETCH_RETRY_DELAY_MS = 500

    const getRecipeByIdResponse = (
        recipeId: string,
        failOnStatusCode = true,
    ): Cypress.Chainable<Cypress.Response<GetRecipeResponse>> => {
        return cy.getCookie('stytch_session_jwt', { log: false }).then((sessionCookie) => {
            if (!sessionCookie?.value) {
                throw new Error('Missing stytch_session_jwt cookie while fetching recipe by id')
            }

            return cy.request<GetRecipeResponse>({
                method: 'GET',
                url: `${Cypress.env('API_BASE_URL')}/recipes/${encodeURIComponent(recipeId)}`,
                headers: {
                    Authorization: `Bearer ${sessionCookie.value}`,
                    'x-api-key': Cypress.env('API_KEY'),
                },
                failOnStatusCode,
            })
        })
    }

    const getRecipeByIdWithTitle = (
        recipeId: string,
        expectedTitle: string,
        retriesRemaining = EDIT_RECIPE_FETCH_RETRIES,
    ): Cypress.Chainable<GetRecipeResponse> => {
        return getRecipeByIdResponse(recipeId, false).then((response) => {
            if (response.status === 200 && response.body.title === expectedTitle) {
                return cy.wrap(response.body)
            }

            if (retriesRemaining <= 0) {
                throw new Error(
                    `Unable to find updated recipe title after retries: ${expectedTitle}`,
                )
            }

            return cy.wait(EDIT_RECIPE_FETCH_RETRY_DELAY_MS, { log: false }).then(() => {
                return getRecipeByIdWithTitle(recipeId, expectedTitle, retriesRemaining - 1)
            })
        })
    }

    beforeEach(() => {
        cy.loginAsTestUser('/recipes/add')

        cy.searchRecipes('').then((recipes) => {
            recipes.forEach((recipe) => {
                createdRecipeIds.push(recipe.id)
            })
        })

        cy.then(() => {
            createdRecipeIds.forEach((recipeId) => {
                cy.deleteRecipe(recipeId)
            })
        })

        cy.then(() => {
            createdRecipeIds.length = 0
        })
    })

    afterEach(() => {
        cy.then(() => {
            createdRecipeIds.forEach((recipeId) => {
                cy.deleteRecipe(recipeId)
            })
        })

        cy.then(() => {
            createdRecipeIds.length = 0
        })
    })

    it('updates an existing recipe via edit route and persists PUT changes on the same recipe id', () => {
        const originalTitle = `Cypress Edit Recipe Seed ${Date.now()}`
        const editedTitle = `${originalTitle} Updated`

        cy.createRecipe(buildBookRecipe(originalTitle)).then(async (recipeId) => {
            createdRecipeIds.push(recipeId)

            cy.visit(`/recipes/${recipeId}/edit`)

            cy.contains(/edit recipe/i).should('be.visible')
            cy.getInputByLabel(/book title/i, 'input').should(
                'have.value',
                'Cypress Recipe Seed Book',
            )

            clickWizardNext()

            cy.getInputByLabel(/recipe title/i, 'input')
                .clear()
                .type(editedTitle)
            clickWizardNext()
            clickWizardNext()
            clickWizardNext()
            clickWizardNext()

            cy.contains('button', /^italian$/i).click()
            cy.intercept('POST', '**/recipes/*/edit').as('submitEditRecipe')
            cy.contains('button', /^finish$/i).click()
            cy.wait('@submitEditRecipe')

            getRecipeByIdWithTitle(recipeId, editedTitle).then((recipe) => {
                expect(recipe.id).to.equal(recipeId)
                expect(recipe.title).to.equal(editedTitle)
                expect(recipe.originalSource.type).to.equal(SourceType.BOOK)
                expect(recipe.tags.cuisine).to.deep.equal(['italian'])
            })
        })
    })
})
