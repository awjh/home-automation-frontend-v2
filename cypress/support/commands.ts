/* eslint-disable @typescript-eslint/no-namespace */

import type {
    DeleteRecipeResponse,
    GetMealPlansResponse,
    GetRecipesResponse,
    PostMealPlanBody,
    PostRecipeBody,
    PostRecipeResponse,
} from '@awjh/home-automation-v2-api-models'

function requireEnvString(name: string, value: unknown) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Missing required Cypress env var: ${name}`)
    }

    return value
}

function getRequiredEnv(name: string): Cypress.Chainable<string> {
    return cy.env([name]).then((values) => requireEnvString(name, values[name]))
}

function getAuthHeaders() {
    return getRequiredEnv('API_KEY').then((apiKey) => {
        return cy
            .getCookie('stytch_session_jwt')
            .should('exist')
            .then((sessionCookie) => ({
                Authorization: `Bearer ${sessionCookie!.value}`,
                'x-api-key': apiKey,
            }))
    })
}

declare global {
    namespace Cypress {
        interface Chainable {
            clearAllMealPlans(): Chainable<Response<GetMealPlansResponse>>
            createMealPlan(mealPlan: PostMealPlanBody): Chainable<Response<unknown>>
            createRecipe(recipe: PostRecipeBody): Chainable<PostRecipeResponse['id']>
            deleteRecipe(recipeId: string): Chainable<Response<DeleteRecipeResponse>>
            getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
            loginAsTestUser(): Chainable<null>
            searchRecipes(keywords: string): Chainable<GetRecipesResponse>
            visitMealPlans(): Chainable<void>
            getInputByLabel(
                label: string | RegExp,
                selector?: 'input' | 'select',
            ): Chainable<JQuery<HTMLInputElement | HTMLSelectElement>>
            clickButtonByText(label: string): Chainable<void>
        }
    }
}

Cypress.Commands.add('getByTestId', (testId: string) => {
    return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add(
    'getInputByLabel',
    (label: string | RegExp, selector: 'input' | 'select' = 'input') => {
        return cy.contains('label', label).parent().find(selector).first()
    },
)

Cypress.Commands.add('clickButtonByText', (label: string) => {
    cy.contains('button', new RegExp(`^${label}$`, 'i')).click()
})

Cypress.Commands.add('loginAsTestUser', () => {
    const mealPlansPath = '/meal-plans'

    return cy
        .env(['CYPRESS_USER', 'CYPRESS_USER_PASSWORD'])
        .then((values) => {
            const email = requireEnvString('CYPRESS_USER', values.CYPRESS_USER)
            const password = requireEnvString('CYPRESS_USER_PASSWORD', values.CYPRESS_USER_PASSWORD)

            return cy.session(
                email,
                () => {
                    cy.intercept('POST', '**/sdk/v1/passwords/authenticate').as(
                        'stytchAuthenticate',
                    )
                    cy.visit(`/login?redirect=${encodeURIComponent(mealPlansPath)}`)
                    cy.get('input[type="email"]').clear().type(email)
                    cy.get('input[type="password"]').clear().type(password, { log: false })
                    cy.contains('button', /^log in$/i).click()
                    cy.wait('@stytchAuthenticate')
                        .its('response.statusCode')
                        .should('be.oneOf', [200, 204])
                    cy.location('pathname', { timeout: 15000 }).should('eq', mealPlansPath)
                    cy.getCookie('stytch_session_jwt', { timeout: 15000 }).should('exist')
                },
                {
                    cacheAcrossSpecs: true,
                    validate: () => {
                        cy.getCookie('stytch_session_jwt').then((sessionCookie) => {
                            cy.wrap(sessionCookie, { log: false }).should('exist')
                        })

                        cy.request({
                            url: mealPlansPath,
                            followRedirect: false,
                            failOnStatusCode: false,
                        }).then((response) => {
                            expect(response.status).to.eq(200)
                        })
                    },
                },
            )
        })
        .then(() => undefined)
})

Cypress.Commands.add('visitMealPlans', () => {
    cy.loginAsTestUser()
    cy.visit('/meal-plans')
    cy.getByTestId('meal-day').should('have.length', 7)
})

Cypress.Commands.add('clearAllMealPlans', () => {
    return getRequiredEnv('API_BASE_URL').then((apiBaseUrl) => {
        return getAuthHeaders().then((headers) => {
            return cy
                .request<GetMealPlansResponse>({
                    method: 'GET',
                    url: `${apiBaseUrl}/meal-plans`,
                    qs: {
                        startDate: '2000-01-01',
                        endDate: '2100-12-31',
                    },
                    headers,
                })
                .then(({ body }) => {
                    if (body.length === 0) {
                        return
                    }

                    body.forEach((mealPlan) => {
                        cy.request({
                            method: 'DELETE',
                            url: `${apiBaseUrl}/meal-plans/${encodeURIComponent(mealPlan.date)}/${encodeURIComponent(mealPlan.mealTime)}/${encodeURIComponent(mealPlan.course)}`,
                            headers,
                        })
                    })

                    return undefined
                })
                .then(() => undefined)
        })
    })
})

Cypress.Commands.add('createMealPlan', (mealPlan: PostMealPlanBody) => {
    return getRequiredEnv('API_BASE_URL').then((apiBaseUrl) => {
        return getAuthHeaders().then((headers) => {
            return cy
                .request({
                    method: 'POST',
                    url: `${apiBaseUrl}/meal-plans`,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json',
                    },
                    body: mealPlan,
                })
                .then(() => undefined)
        })
    })
})

Cypress.Commands.add('createRecipe', (recipe: PostRecipeBody) => {
    return getRequiredEnv('API_BASE_URL').then((apiBaseUrl) => {
        return getAuthHeaders().then((headers) => {
            return cy
                .request<PostRecipeResponse>({
                    method: 'POST',
                    url: `${apiBaseUrl}/recipes`,
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json',
                    },
                    body: recipe,
                })
                .its('body.id')
        })
    })
})

Cypress.Commands.add('deleteRecipe', (recipeId: string) => {
    return getRequiredEnv('API_BASE_URL').then((apiBaseUrl) => {
        return getAuthHeaders().then((headers) => {
            return cy
                .request({
                    method: 'DELETE',
                    url: `${apiBaseUrl}/recipes/${encodeURIComponent(recipeId)}`,
                    headers,
                    failOnStatusCode: false,
                })
                .then(() => undefined)
        })
    })
})

Cypress.Commands.add('searchRecipes', (keywords: string) => {
    return getRequiredEnv('API_BASE_URL').then((apiBaseUrl) => {
        return getAuthHeaders().then((headers) => {
            return cy
                .request<GetRecipesResponse>({
                    method: 'GET',
                    url: `${apiBaseUrl}/recipes`,
                    headers,
                    qs: {
                        keywords,
                        filters: JSON.stringify({}),
                        tags: JSON.stringify({
                            cuisine: [],
                            mealType: [],
                            meat: [],
                            dietary: [],
                            occasion: [],
                            equipment: [],
                        }),
                    },
                })
                .its('body')
        })
    })
})

export {}
