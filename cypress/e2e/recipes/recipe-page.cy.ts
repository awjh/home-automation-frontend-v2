import type { GetMealPlansResponse } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { buildBookRecipe } from './recipeBuilders/buildRecipe'

describe('recipe page', () => {
    const createdRecipeIds: string[] = []

    beforeEach(() => {
        cy.loginAsTestUser()
        cy.clearAllMealPlans()
    })

    afterEach(() => {
        cy.getCookie('stytch_session_jwt', { log: false }).then((sessionCookie) => {
            if (!sessionCookie) {
                return
            }

            cy.clearAllMealPlans()
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

    it('loads and shows recipe content', () => {
        const recipeTitle = `Cypress Recipe View ${Date.now()}`

        cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
            createdRecipeIds.push(recipeId)

            cy.visit(`/recipes/${recipeId}`)

            cy.contains('h1', recipeTitle).should('be.visible')
            cy.contains('h2', 'Andrew Hurt').should('be.visible')
            cy.get('body').should('contain.text', 'Pasta')
            cy.get('body').should('contain.text', 'Cook the pasta and combine everything.')
        })
    })

    it('renders recipe image when image id is recipe.jpg', () => {
        const recipeTitle = `Cypress Recipe Image ${Date.now()}`

        cy.createRecipe({
            ...buildBookRecipe(recipeTitle),
            image: 'recipe.jpg',
        }).then((recipeId) => {
            createdRecipeIds.push(recipeId)

            cy.visit(`/recipes/${recipeId}`)

            cy.get(`img[alt="${recipeTitle}"]`)
                .should('be.visible')
                .and('have.attr', 'src')
                .and('include', 'recipe.jpg')
        })
    })

    it('adds the recipe to meal planner from the recipe page', () => {
        const recipeTitle = `Cypress Recipe Add ${Date.now()}`

        cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
            createdRecipeIds.push(recipeId)

            cy.visit(`/recipes/${recipeId}`)

            cy.contains(/monday/i).click()

            cy.getByTestId('add-meal-plan-modal')
                .should('be.visible')
                .and('have.attr', 'data-mode', 'add')
                .within(() => {
                    cy.contains(/setup meal plan for recipe/i).should('be.visible')
                    cy.getInputByLabel(/meal time/i, 'select').select(MealTime.DINNER, {
                        force: true,
                    })
                    cy.getInputByLabel(/course/i, 'select').select(Course.MAIN, {
                        force: true,
                    })
                    cy.getInputByLabel(/source/i, 'select')
                        .should('be.disabled')
                        .and('have.value', SourceType.INTERNAL_RECIPE)
                    cy.clickButtonByText('Next')
                    cy.clickButtonByText('Submit')
                })

            cy.getByTestId('add-meal-plan-modal').should('not.exist')

            cy.getCookie('stytch_session_jwt', { log: false }).then((sessionCookie) => {
                cy.request<GetMealPlansResponse>({
                    method: 'GET',
                    url: `${Cypress.env('API_BASE_URL')}/meal-plans`,
                    headers: {
                        Authorization: `Bearer ${sessionCookie!.value}`,
                        'x-api-key': Cypress.env('API_KEY'),
                    },
                    qs: {
                        startDate: '2000-01-01',
                        endDate: '2100-12-31',
                    },
                }).then(({ body }) => {
                    const recipeMealPlans = body.filter(
                        (mealPlan) =>
                            mealPlan.source.type === SourceType.INTERNAL_RECIPE &&
                            mealPlan.source.recipeId === recipeId,
                    )

                    expect(recipeMealPlans).to.have.length(1)
                    expect(recipeMealPlans[0].title).to.equal(recipeTitle)
                    expect(recipeMealPlans[0].mealTime).to.equal(MealTime.DINNER)
                    expect(recipeMealPlans[0].course).to.equal(Course.MAIN)
                })
            })
        })
    })

    it('removes the recipe meal plan from the recipe page', () => {
        const recipeTitle = `Cypress Recipe Remove ${Date.now()}`

        cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
            createdRecipeIds.push(recipeId)

            cy.visit(`/recipes/${recipeId}`)

            cy.contains(/monday/i).click()

            cy.getByTestId('add-meal-plan-modal').within(() => {
                cy.getInputByLabel(/meal time/i, 'select').select(MealTime.DINNER, {
                    force: true,
                })
                cy.getInputByLabel(/course/i, 'select').select(Course.MAIN, {
                    force: true,
                })
                cy.clickButtonByText('Next')
                cy.clickButtonByText('Submit')
            })

            cy.getByTestId('add-meal-plan-modal').should('not.exist')

            cy.contains(/monday/i).click()
            cy.contains(/delete meal plan\?/i).should('be.visible')
            cy.clickButtonByText('Confirm')
            cy.contains(/delete meal plan\?/i).should('not.exist')

            cy.getCookie('stytch_session_jwt', { log: false }).then((sessionCookie) => {
                cy.request<GetMealPlansResponse>({
                    method: 'GET',
                    url: `${Cypress.env('API_BASE_URL')}/meal-plans`,
                    headers: {
                        Authorization: `Bearer ${sessionCookie!.value}`,
                        'x-api-key': Cypress.env('API_KEY'),
                    },
                    qs: {
                        startDate: '2000-01-01',
                        endDate: '2100-12-31',
                    },
                }).then(({ body }) => {
                    const recipeMealPlans = body.filter(
                        (mealPlan) =>
                            mealPlan.source.type === SourceType.INTERNAL_RECIPE &&
                            mealPlan.source.recipeId === recipeId,
                    )

                    expect(recipeMealPlans).to.have.length(0)
                })
            })
        })
    })
})
