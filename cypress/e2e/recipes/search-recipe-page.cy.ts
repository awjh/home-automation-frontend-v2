import { PostRecipeBody } from '@awjh/home-automation-v2-api-models'
import { Cuisine } from '@awjh/home-automation-v2-api-models/recipes'
import { buildBookRecipe } from './recipeBuilders/buildRecipe'

function withCuisine(cuisine: Cuisine[]): PostRecipeBody['tags'] {
    return {
        cuisine,
        mealType: [],
        meat: [],
        dietary: [],
        occasion: [],
        equipment: [],
    }
}

type Viewport = {
    name: 'desktop' | 'mobile'
    width: number
    height: number
}

const viewports: Viewport[] = [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'mobile', width: 375, height: 812 },
]

// Results render in both a mobile and desktop container; only one is displayed per viewport
function getVisibleResult(title: string) {
    return cy.contains('h3:visible', title)
}

function openFilters(viewport: Viewport) {
    if (viewport.name === 'desktop') {
        cy.get('button[aria-label="toggle-recipe-filters"]').click()
    } else {
        cy.contains('button:visible', /^Filters/).click()
    }
}

// On mobile the filters and results are separate tabs, so switch back after filtering
function showResults(viewport: Viewport) {
    if (viewport.name === 'mobile') {
        cy.contains('button:visible', /^Results/).click()
    }
}

function assertResultCount(viewport: Viewport, count: number) {
    if (viewport.name === 'desktop') {
        cy.contains('h2:visible', `Search Results (${count})`).should('exist')
    } else {
        cy.contains('button:visible', `Results (${count})`).should('exist')
    }
}

function selectTag(tag: string) {
    getTag(tag).click()
}

function getSliderThumbs(label: string) {
    return cy.contains('label:visible', `${label} (`).parent().find('[role="slider"]')
}

function setServesMinimum(min: number) {
    // Serves slider starts at 1 with a step of 1
    const presses = '{rightarrow}'.repeat(min - 1)

    getSliderThumbs('serves').first().focus().type(presses)
    cy.contains('label:visible', `serves (${min} - 100)`).should('exist')
}

function applyFilters() {
    cy.contains('button:visible', 'Apply Filters').click()
}

function cancelFilters() {
    cy.contains('button:visible', 'Cancel').click()
}

function getTag(tag: string) {
    return cy.contains('button:visible', new RegExp(`^${tag}$`))
}

// Searching re-renders the page via a React Server Component request for /recipes
function interceptSearchRequests() {
    cy.intercept({ method: 'GET', pathname: '/recipes', headers: { rsc: '1' } }).as('search')
}

function searchKeywords(keywords: string) {
    cy.get('input[placeholder="Search keywords"]').type(keywords)
    cy.get('button').contains('Search').click()
}

viewports.forEach((viewport) => {
    describe(`Search Recipe Page (${viewport.name})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.loginAsTestUser()
            cy.deleteAllRecipes()
        })

        afterEach(() => {
            cy.getCookie('stytch_session_jwt', { log: false }).then((sessionCookie) => {
                if (!sessionCookie) {
                    return
                }

                cy.deleteAllRecipes()
            })
        })

        it('shows all recipes on load', () => {
            const suffix = Date.now()
            const titles = [
                `Cypress Lasagne ${suffix}`,
                `Cypress Mushroom Risotto ${suffix}`,
                `Cypress Fish Pie ${suffix}`,
            ]

            titles.forEach((title) => cy.createRecipe(buildBookRecipe(title)))

            cy.visit('/recipes')
            assertResultCount(viewport, titles.length)
            titles.forEach((title) => getVisibleResult(title).should('be.visible'))
        })

        it('searches for a recipe by keywords', () => {
            const keywordsRecipe = `Cypress Recipe ${Date.now()}`

            cy.createRecipe(buildBookRecipe(keywordsRecipe)).then(() => {
                cy.visit('/recipes')
                searchKeywords(keywordsRecipe)
                getVisibleResult(keywordsRecipe).should('be.visible')
            })
        })

        it('searches for a recipe by tags', () => {
            const suffix = Date.now()
            const italianRecipe = `Cypress Lasagne ${suffix}`
            const britishRecipe = `Cypress Fish Pie ${suffix}`
            const untaggedRecipe = `Cypress Mushroom Risotto ${suffix}`

            cy.createRecipe(
                buildBookRecipe(italianRecipe, { tags: withCuisine([Cuisine.ITALIAN]) }),
            )
            cy.createRecipe(
                buildBookRecipe(britishRecipe, { tags: withCuisine([Cuisine.BRITISH]) }),
            )
            cy.createRecipe(buildBookRecipe(untaggedRecipe))

            cy.visit('/recipes')
            openFilters(viewport)
            selectTag(Cuisine.ITALIAN)
            applyFilters()

            cy.location('search').should('contain', 'tags=')
            showResults(viewport)
            assertResultCount(viewport, 1)
            getVisibleResult(italianRecipe).should('be.visible')
            getVisibleResult(britishRecipe).should('not.exist')
            getVisibleResult(untaggedRecipe).should('not.exist')
        })

        it('searches for a recipe by sliding filters', () => {
            const suffix = Date.now()
            const familyRecipe = `Cypress Lasagne ${suffix}`
            const smallRecipe = `Cypress Fish Pie ${suffix}`

            cy.createRecipe(buildBookRecipe(familyRecipe, { produces: { serves: 6 } }))
            cy.createRecipe(buildBookRecipe(smallRecipe, { produces: { serves: 2 } }))

            cy.visit('/recipes')
            openFilters(viewport)
            setServesMinimum(5)
            applyFilters()

            cy.location('search').should('contain', 'filters=')
            showResults(viewport)
            assertResultCount(viewport, 1)
            getVisibleResult(familyRecipe).should('be.visible')
            getVisibleResult(smallRecipe).should('not.exist')
        })

        it('searches for a recipe by keywords, tags and sliding filters combined', () => {
            const suffix = Date.now()
            const matchingRecipe = `Cypress Lasagne ${suffix}`
            const tooSmallRecipe = `Cypress Lasagne Small ${suffix}`
            const wrongCuisineRecipe = `Cypress Lasagne Roast ${suffix}`
            const wrongKeywordsRecipe = `Cypress Mushroom Risotto ${suffix}`

            const italian = withCuisine([Cuisine.ITALIAN])

            cy.createRecipe(
                buildBookRecipe(matchingRecipe, { tags: italian, produces: { serves: 6 } }),
            )
            cy.createRecipe(
                buildBookRecipe(tooSmallRecipe, { tags: italian, produces: { serves: 2 } }),
            )
            cy.createRecipe(
                buildBookRecipe(wrongCuisineRecipe, {
                    tags: withCuisine([Cuisine.BRITISH]),
                    produces: { serves: 6 },
                }),
            )
            cy.createRecipe(
                buildBookRecipe(wrongKeywordsRecipe, { tags: italian, produces: { serves: 6 } }),
            )

            cy.visit('/recipes')
            openFilters(viewport)
            selectTag(Cuisine.ITALIAN)
            setServesMinimum(5)
            applyFilters()

            cy.location('search').should('contain', 'filters=')
            searchKeywords('Lasagne')

            cy.location('search').should('contain', 'keywords=Lasagne')
            showResults(viewport)
            assertResultCount(viewport, 1)
            getVisibleResult(matchingRecipe).should('be.visible')
            getVisibleResult(tooSmallRecipe).should('not.exist')
            getVisibleResult(wrongCuisineRecipe).should('not.exist')
            getVisibleResult(wrongKeywordsRecipe).should('not.exist')
        })

        it('clears selected tags on cancel without searching again', () => {
            const suffix = Date.now()
            const italianRecipe = `Cypress Lasagne ${suffix}`
            const britishRecipe = `Cypress Fish Pie ${suffix}`

            cy.createRecipe(
                buildBookRecipe(italianRecipe, { tags: withCuisine([Cuisine.ITALIAN]) }),
            )
            cy.createRecipe(
                buildBookRecipe(britishRecipe, { tags: withCuisine([Cuisine.BRITISH]) }),
            )

            cy.visit('/recipes')
            assertResultCount(viewport, 2)
            interceptSearchRequests()

            openFilters(viewport)
            selectTag(Cuisine.ITALIAN)
            getTag(Cuisine.ITALIAN).should('have.attr', 'data-status', 'highlighted')
            cancelFilters()

            // Cancel closes the filters (desktop) or returns to the Results tab (mobile)
            cy.contains('button:visible', 'Apply Filters').should('not.exist')
            cy.location('search').should('eq', '')
            cy.get('@search.all').should('have.length', 0)
            assertResultCount(viewport, 2)
            getVisibleResult(italianRecipe).should('be.visible')
            getVisibleResult(britishRecipe).should('be.visible')

            openFilters(viewport)
            getTag(Cuisine.ITALIAN).should('have.attr', 'data-status', 'default')
        })

        it('opens a recipe when its title is clicked', () => {
            const recipeTitle = `Cypress Lasagne ${Date.now()}`

            cy.createRecipe(buildBookRecipe(recipeTitle)).then((recipeId) => {
                cy.visit('/recipes')
                getVisibleResult(recipeTitle).click()

                cy.location('pathname').should('eq', `/recipes/${recipeId}`)
                cy.contains('h1', recipeTitle).should('be.visible')
            })
        })
    })
})
