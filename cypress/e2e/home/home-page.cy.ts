import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import BookMealPlanWithOptional from '@test/mockData/mealPlans/BookMealPlanWithOptional'
import createBookMealPlan from '@test/mockData/mealPlans/createBookMealPlan'
import createFreezerMealPlan from '@test/mockData/mealPlans/createFreezerMealPlan'
import createInternalRecipeMealPlan from '@test/mockData/mealPlans/createInternalRecipeMealPlan'
import createMagazineMealPlan from '@test/mockData/mealPlans/createMagazineMealPlan'
import createPostMealPlanFixture from '@test/mockData/mealPlans/createPostMealPlanFixture'
import MagazineMealPlan from '@test/mockData/mealPlans/MagazineMealPlan'
import OnlineMealPlan from '@test/mockData/mealPlans/OnlineMealPlan'
import addDays from '../mealPlans/utils/addDays'
import formatIsoDate from '../mealPlans/utils/formatIsoDate'
import getStartOfWeek from '../mealPlans/utils/getStartOfWeek'
import { buildBookRecipe } from '../recipes/recipeBuilders/buildRecipe'

type Viewport = {
    name: 'desktop' | 'mobile'
    width: number
    height: number
}

const viewports: Viewport[] = [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'mobile', width: 375, height: 812 },
]

function dateFromSunday(days: number) {
    return formatIsoDate(addDays(getStartOfWeek(), days))
}

// On mobile, cards off to the right are clipped by the scrolling row until scrolled into view
function getMealCard(title: string) {
    return cy.get(`[data-testid="upcoming-meal"][data-title="${title}"]`).scrollIntoView()
}

viewports.forEach((viewport) => {
    describe(`Home Page (${viewport.name})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
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

        it('shows meals from the most recent Sunday onwards in date order', () => {
            const seed = `Cypress ${Date.now()}`
            const sundayMeal = `${seed} Sunday Roast`
            const laterMeal = `${seed} Midweek Curry`
            const nextWeekMeal = `${seed} Next Week Pie`
            const lastWeekMeal = `${seed} Last Week Stew`

            cy.createMealPlan(createBookMealPlan(dateFromSunday(3), MealTime.DINNER, laterMeal))
            cy.createMealPlan(createBookMealPlan(dateFromSunday(0), MealTime.DINNER, sundayMeal))
            cy.createMealPlan(createBookMealPlan(dateFromSunday(8), MealTime.DINNER, nextWeekMeal))
            cy.createMealPlan(createBookMealPlan(dateFromSunday(-1), MealTime.DINNER, lastWeekMeal))

            cy.visit('/')
            cy.contains('h2', /^upcoming meals$/i).should('be.visible')

            cy.get('[data-testid="upcoming-meal"]').then((cards) => {
                const titles = cards.toArray().map((card) => card.dataset.title)
                expect(titles).to.deep.equal([sundayMeal, laterMeal, nextWeekMeal])
            })
            cy.get(`[data-title="${lastWeekMeal}"]`).should('not.exist')
        })

        it('shows book and magazine details under the author', () => {
            const seed = `Cypress ${Date.now()}`
            const bookMeal = `${seed} Book Jalfrezi`
            const magazineMeal = `${seed} Magazine Wellington`
            const { source: bookSource } = BookMealPlanWithOptional
            const { source: magazineSource } = MagazineMealPlan

            cy.createMealPlan(createBookMealPlan(dateFromSunday(1), MealTime.DINNER, bookMeal))
            cy.createMealPlan(
                createMagazineMealPlan(dateFromSunday(2), MealTime.DINNER, magazineMeal),
            )

            cy.visit('/')

            getMealCard(bookMeal).within(() => {
                cy.contains(BookMealPlanWithOptional.author).should('be.visible')

                if (bookSource.type === SourceType.BOOK) {
                    cy.contains(
                        `${bookSource.series} - ${bookSource.title} (p. ${bookSource.page})`,
                    ).should('be.visible')
                }
            })

            getMealCard(magazineMeal).within(() => {
                cy.contains(MagazineMealPlan.author).should('be.visible')

                if (magazineSource.type === SourceType.MAGAZINE) {
                    cy.contains(
                        `${magazineSource.title}, ${magazineSource.issue} (p. ${magazineSource.page})`,
                    ).should('be.visible')
                }
            })
        })

        it('links online meals to their source and leaves other sources unlinked', () => {
            const seed = `Cypress ${Date.now()}`
            const onlineMeal = `${seed} Online Gnocchi`
            const freezerMeal = `${seed} Freezer Chilli`

            cy.createMealPlan(
                createPostMealPlanFixture(OnlineMealPlan, {
                    date: dateFromSunday(1),
                    mealTime: MealTime.DINNER,
                    title: onlineMeal,
                }),
            )
            cy.createMealPlan(
                createFreezerMealPlan(dateFromSunday(2), MealTime.DINNER, freezerMeal),
            )

            cy.visit('/')

            getMealCard(onlineMeal)
                .closest('a')
                .should(
                    'have.attr',
                    'href',
                    OnlineMealPlan.source.type === SourceType.ONLINE
                        ? OnlineMealPlan.source.url
                        : '',
                )
            getMealCard(onlineMeal).within(() => {
                cy.contains('bbcgoodfood.com').should('be.visible')
            })
            getMealCard(freezerMeal).closest('a').should('not.exist')
        })

        it('opens the recipe page when an internal recipe meal is clicked', () => {
            const recipeTitle = `Cypress ${Date.now()} Pasta Bake`

            cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
                cy.createMealPlan(
                    createInternalRecipeMealPlan(
                        dateFromSunday(1),
                        MealTime.DINNER,
                        recipeTitle,
                        recipeId,
                    ),
                )

                cy.visit('/')
                getMealCard(recipeTitle).click()

                // The recipe route may compile on first visit in `next dev`, and Next only updates
                // the URL once the new page has loaded
                cy.location('pathname', { timeout: 20000 }).should('eq', `/recipes/${recipeId}`)
                cy.contains('h1', recipeTitle).should('be.visible')
            })
        })

        it(`lays out meals for ${viewport.name} without widening the page`, () => {
            const seed = `Cypress ${Date.now()}`

            Array.from({ length: 6 }, (_, index) => index).forEach((index) => {
                cy.createMealPlan(
                    createBookMealPlan(dateFromSunday(index), MealTime.DINNER, `${seed} ${index}`),
                )
            })

            cy.visit('/')

            cy.get('[data-testid="upcoming-meals-list"]').should(($list) => {
                const list = $list[0]

                if (viewport.name === 'desktop') {
                    expect(getComputedStyle(list).display).to.equal('grid')
                    expect(list.scrollWidth).to.be.at.most(list.clientWidth)
                } else {
                    expect(getComputedStyle(list).display).to.equal('flex')
                    expect(list.scrollWidth).to.be.greaterThan(list.clientWidth)
                }
            })

            cy.document().should((doc) => {
                expect(doc.documentElement.scrollWidth).to.be.at.most(
                    doc.documentElement.clientWidth,
                )
            })
        })
    })
})
