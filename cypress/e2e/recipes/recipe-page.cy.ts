import type { GetMealPlansResponse } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import createInternalRecipeMealPlan from '@test/mockData/mealPlans/createInternalRecipeMealPlan'
import { buildBookRecipe } from './recipeBuilders/buildRecipe'
import addDays from '../mealPlans/utils/addDays'
import formatIsoDate from '../mealPlans/utils/formatIsoDate'
import getMondayOfWeek from '../mealPlans/utils/getMondayOfWeek'

describe('recipe page', () => {
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
            cy.deleteAllRecipes()
        })
    })

    it('loads and shows recipe content', () => {
        const recipeTitle = `Cypress Recipe View ${Date.now()}`

        cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
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
            image: '/recipe.jpg',
        }).then((recipeId) => {
            cy.visit(`/recipes/${recipeId}`)

            cy.get(`img[alt="${recipeTitle}"]`)
                .should('be.visible')
                .and('have.attr', 'src')
                .and('include', 'recipe.jpg')
        })
    })

    it('highlights days the recipe is already planned for on page load', () => {
        const recipeTitle = `Cypress Recipe Planned ${Date.now()}`
        const otherRecipeTitle = `Cypress Recipe Other ${Date.now()}`
        const mondayOfWeek = getMondayOfWeek()

        cy.createRecipe(buildBookRecipe(otherRecipeTitle)).then((otherRecipeId) => {
            cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
                // This week's plans are highlighted, the following two weeks are subtle
                cy.createMealPlan(
                    createInternalRecipeMealPlan(
                        formatIsoDate(addDays(mondayOfWeek, 2)),
                        MealTime.DINNER,
                        recipeTitle,
                        recipeId,
                    ),
                )
                cy.createMealPlan(
                    createInternalRecipeMealPlan(
                        formatIsoDate(addDays(mondayOfWeek, 7)),
                        MealTime.DINNER,
                        recipeTitle,
                        recipeId,
                    ),
                )
                // Outside the three week window so not shown
                cy.createMealPlan(
                    createInternalRecipeMealPlan(
                        formatIsoDate(addDays(mondayOfWeek, 25)),
                        MealTime.DINNER,
                        recipeTitle,
                        recipeId,
                    ),
                )
                // A different recipe so not shown
                cy.createMealPlan(
                    createInternalRecipeMealPlan(
                        formatIsoDate(addDays(mondayOfWeek, 1)),
                        MealTime.DINNER,
                        otherRecipeTitle,
                        otherRecipeId,
                    ),
                )

                cy.visit(`/recipes/${recipeId}`)

                cy.contains('button', /monday/i).should('have.attr', 'data-status', 'subtle')
                cy.contains('button', /tuesday/i).should('have.attr', 'data-status', 'default')
                cy.contains('button', /wednesday/i).should(
                    'have.attr',
                    'data-status',
                    'highlighted',
                )
                cy.contains('button', /thursday/i).should('have.attr', 'data-status', 'default')
                cy.contains('button', /friday/i).should('have.attr', 'data-status', 'default')

                // Clicking a planned day offers to delete it rather than add a new one
                cy.contains('button', /wednesday/i).click()
                cy.contains(/delete meal plan\?/i).should('be.visible')
            })
        })
    })

    it('adds the recipe to meal planner from the recipe page', () => {
        const recipeTitle = `Cypress Recipe Add ${Date.now()}`

        const nextMondayDateString = formatIsoDate(addDays(getMondayOfWeek(), 7))

        cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
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
                    expect(recipeMealPlans[0].date).to.equal(nextMondayDateString)
                })
            })
        })
    })

    it('adds the recipe to meal planner from the recipe page and sets it as leftovers', () => {
        const recipeTitle = `Cypress Recipe Add with leftovers ${Date.now()}`
        // The weekday buttons create meal plans for that weekday in the following week
        const mondayOfWeek = getMondayOfWeek()
        const tuesdayDateString = formatIsoDate(addDays(mondayOfWeek, 8))
        const wednesdayDateString = formatIsoDate(addDays(mondayOfWeek, 9))

        cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
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
