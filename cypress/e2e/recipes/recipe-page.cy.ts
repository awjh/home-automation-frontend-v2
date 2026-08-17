import type { GetMealPlansResponse } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { buildBookRecipe } from './recipeBuilders/buildRecipe'
import getStartOfWeek from '../mealPlans/utils/getStartOfWeek'

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

        const startOfWeek = new Date()
        startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7)) // Monday of the current week
        const nextWeekStart = new Date(startOfWeek)
        nextWeekStart.setDate(nextWeekStart.getDate() + 7)

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
                    // The recipe page treats the clicked weekday as a template and opens
                    // the modal for the matching weekday in the following week.
                    expect(recipeMealPlans[0].date).to.equal(
                        nextWeekStart.toISOString().split('T')[0],
                    )
                })
            })
        })
    })

    it('adds the recipe to meal planner from the recipe page and sets it as leftovers', () => {
        const recipeTitle = `Cypress Recipe Add with leftovers ${Date.now()}`
        const startOfWeek = getStartOfWeek()
        const tuesdayDate = new Date(startOfWeek)
        tuesdayDate.setDate(tuesdayDate.getDate() + 10) // meal planner buttons use next week for meal dates
        const tuesdayDateString = tuesdayDate.toISOString().split('T')[0]
        const wednesdayDate = new Date(startOfWeek)
        wednesdayDate.setDate(wednesdayDate.getDate() + 11)
        const wednesdayDateString = wednesdayDate.toISOString().split('T')[0]

        cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
            createdRecipeIds.push(recipeId)

            cy.visit(`/recipes/${recipeId}`)

            cy.contains(/tuesday/i).click()

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
                    cy.getInputByLabel(/use for leftovers\?/i, 'select').select('true', {
                        force: true,
                    })
                    cy.getInputByLabel(/when will the leftovers be used\?/i, 'input').type(
                        wednesdayDateString,
                    )
                    cy.clickButtonByText('Next')
                    cy.clickButtonByText('Submit')
                })

            cy.getByTestId('add-meal-plan-modal')
                .should('be.visible')
                .and('have.attr', 'data-mode', 'add')
                .within(() => {
                    cy.contains(/setup leftovers meal plan for recipe/i).should('be.visible')
                    cy.getInputByLabel(/meal time/i, 'select').select(MealTime.LUNCH, {
                        force: true,
                    })
                    cy.getInputByLabel(/course/i, 'select').select(Course.MAIN, {
                        force: true,
                    })
                    cy.getInputByLabel(/source/i, 'select')
                        .should('be.disabled')
                        .and('have.value', SourceType.LEFTOVERS)
                    cy.clickButtonByText('Next')
                    cy.clickButtonByText('Next')

                    cy.getInputByLabel(/preparation time/i, 'input')
                        .clear()
                        .type('0')
                    cy.getInputByLabel(/cooking time/i, 'input')
                        .clear()
                        .type('20')
                    cy.getInputByLabel(/standing time/i, 'input')
                        .clear()
                        .type('0')

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
                    expect(recipeMealPlans[0].date).to.equal(tuesdayDateString)

                    const leftoverMealPlans = body.filter(
                        (mealPlan) =>
                            mealPlan.source.type === SourceType.LEFTOVERS &&
                            mealPlan.source.fromDate === tuesdayDateString &&
                            mealPlan.source.fromMealTime === MealTime.DINNER &&
                            mealPlan.source.fromCourse === Course.MAIN,
                    )

                    expect(leftoverMealPlans).to.have.length(1)
                    expect(leftoverMealPlans[0].mealTime).to.equal(MealTime.LUNCH)
                    expect(leftoverMealPlans[0].course).to.equal(Course.MAIN)
                    expect(leftoverMealPlans[0].date).to.equal(wednesdayDateString)
                    expect(recipeMealPlans[0].title).to.equal(recipeTitle)
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
