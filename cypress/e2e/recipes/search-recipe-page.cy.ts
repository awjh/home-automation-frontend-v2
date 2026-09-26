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

// The API returns this many recipes per page
const PAGE_SIZE = 15

function createRecipes(titles: string[], overrides: Partial<PostRecipeBody> = {}) {
    titles.forEach((title) => cy.createRecipe(buildBookRecipe(title, overrides)))
}

function buildTitles(prefix: string, count: number) {
    return Array.from({ length: count }, (_, index) => `${prefix} ${index + 1}`)
}

// Loading more runs a server action, which posts back to the /recipes page
function interceptLoadMoreRequests() {
    cy.intercept({ method: 'POST', pathname: '/recipes' }).as('loadMore')
}

function getLoadMoreButton() {
    return cy.contains('button:visible', /^Load More$/)
}

function loadMore() {
    getLoadMoreButton().click()
    cy.wait('@loadMore')
}

function getVisibleResultTitles() {
    return cy.get('h3:visible').then(($headings) => $headings.toArray().map((h) => h.innerText))
}

// Checks the rendered results rather than just the counter, and that no page was loaded twice
function assertVisibleResults(viewport: Viewport, count: number) {
    assertResultCount(viewport, count)
    getVisibleResultTitles().then((titles) => {
        expect(titles).to.have.length(count)
        expect(new Set(titles).size).to.eq(count)
    })
}

function assertAllResultsStartWith(prefix: string) {
    getVisibleResultTitles().then((titles) => {
        titles.forEach((title) => expect(title).to.match(new RegExp(`^${prefix} \\d+ - `)))
    })
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

        it('loads the next page of results and starts from the first page again on refresh', () => {
            const titles = buildTitles(`Cypress Paged Recipe ${Date.now()}`, PAGE_SIZE + 2)

            createRecipes(titles)

            cy.visit('/recipes')
            interceptLoadMoreRequests()
            assertVisibleResults(viewport, PAGE_SIZE)

            loadMore()

            assertVisibleResults(viewport, titles.length)
            titles.forEach((title) => getVisibleResult(title).should('exist'))
            getLoadMoreButton().should('not.exist')
            // Pages beyond the first are not kept in the URL
            cy.location('search').should('eq', '')

            cy.reload()

            assertVisibleResults(viewport, PAGE_SIZE)
            getLoadMoreButton().should('be.visible')
        })

        it('does not show load more when all results fit on one page', () => {
            createRecipes(buildTitles(`Cypress Single Page Recipe ${Date.now()}`, 3))

            cy.visit('/recipes')
            assertVisibleResults(viewport, 3)
            getLoadMoreButton().should('not.exist')
        })

        it('returns to the first page when filters are applied after loading the next page', () => {
            const suffix = Date.now()
            const italianPrefix = `Cypress Italian ${suffix}`
            const britishPrefix = `Cypress British ${suffix}`
            const italianTitles = buildTitles(italianPrefix, PAGE_SIZE + 1)
            const britishTitles = buildTitles(britishPrefix, 2)

            createRecipes(italianTitles, { tags: withCuisine([Cuisine.ITALIAN]) })
            createRecipes(britishTitles, { tags: withCuisine([Cuisine.BRITISH]) })

            cy.visit('/recipes')
            interceptLoadMoreRequests()
            assertVisibleResults(viewport, PAGE_SIZE)

            loadMore()
            assertVisibleResults(viewport, italianTitles.length + britishTitles.length)

            openFilters(viewport)
            selectTag(Cuisine.ITALIAN)
            applyFilters()

            cy.location('search').should('contain', 'tags=')
            showResults(viewport)
            // Back to a single, filtered first page rather than the two pages already loaded
            assertVisibleResults(viewport, PAGE_SIZE)
            assertAllResultsStartWith(italianPrefix)

            // The next page continues the filtered search
            loadMore()
            assertVisibleResults(viewport, italianTitles.length)
            assertAllResultsStartWith(italianPrefix)
            getLoadMoreButton().should('not.exist')
        })

        it('returns to the first page when keywords are searched after loading the next page', () => {
            const suffix = Date.now()
            const lasagnePrefix = `Cypress Lasagne ${suffix}`
            const lasagneTitles = buildTitles(lasagnePrefix, PAGE_SIZE + 1)
            const risottoTitles = buildTitles(`Cypress Risotto ${suffix}`, 2)

            createRecipes([...lasagneTitles, ...risottoTitles])

            cy.visit('/recipes')
            interceptLoadMoreRequests()
            assertVisibleResults(viewport, PAGE_SIZE)

            loadMore()
            assertVisibleResults(viewport, lasagneTitles.length + risottoTitles.length)

            searchKeywords('Lasagne')

            cy.location('search').should('contain', 'keywords=Lasagne')
            assertVisibleResults(viewport, PAGE_SIZE)
            assertAllResultsStartWith(lasagnePrefix)

            loadMore()
            assertVisibleResults(viewport, lasagneTitles.length)
            assertAllResultsStartWith(lasagnePrefix)
            getLoadMoreButton().should('not.exist')
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
