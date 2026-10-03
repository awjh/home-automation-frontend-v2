import { PostRecordBody } from '@awjh/home-automation-v2-api-models'
import { Genre, RecordFormat } from '@awjh/home-automation-v2-api-models/records'
import { buildRecord } from './recordBuilders/buildRecord'

// Records can't be deleted through the API yet, so each test searches on a keyword only its own
// records have rather than relying on what else is in the account. The keyword search is fuzzy and
// favours the start of the title, so the keyword is random letters at the start of each title.

type Viewport = {
    name: 'desktop' | 'mobile'
    width: number
    height: number
}

const viewports: Viewport[] = [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'mobile', width: 375, height: 812 },
]

// The API returns this many records per page
const PAGE_SIZE = 15

function uniqueKeyword() {
    return Array.from({ length: 20 }, () =>
        String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    ).join('')
}

function createRecords(titles: string[], overrides: Partial<PostRecordBody> = {}) {
    titles.forEach((title, index) =>
        cy.createRecord(buildRecord(title, { catNo: `CY ${Date.now()} ${index}`, ...overrides })),
    )
}

// Results render in both a mobile and desktop container; only one is displayed per viewport
function getVisibleResult(title: string) {
    return cy.contains('h3:visible', title)
}

function getVisibleResultTitles() {
    return cy.get('h3:visible').then(($headings) => $headings.toArray().map((h) => h.innerText))
}

function searchKeywords(keywords: string) {
    cy.get('input[placeholder="Search keywords"]').clear().type(keywords)
    cy.get('button').contains('Search').click()
    cy.location('search').should('contain', `keywords=${keywords}`)
}

function openFilters(viewport: Viewport) {
    if (viewport.name === 'desktop') {
        cy.get('button[aria-label="toggle-record-filters"]').click()
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

function selectTag(tag: string) {
    cy.contains('button:visible', new RegExp(`^${tag}$`)).click()
}

function applyFilters() {
    cy.contains('button:visible', 'Apply Filters').click()
}

function assertResultCount(viewport: Viewport, label: string) {
    if (viewport.name === 'desktop') {
        cy.contains('h2:visible', `Search Results (${label})`).should('exist')
    } else {
        cy.contains('button:visible', `Results (${label})`).should('exist')
    }
}

viewports.forEach((viewport) => {
    describe(`Search Record Page (${viewport.name})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.loginAsTestUser('/records')
        })

        it('lists records on load and opens one', () => {
            const keyword = uniqueKeyword()
            const title = `${keyword} Cypress Record`

            createRecords([title])

            cy.visit('/records')
            cy.get('h3:visible').should('have.length.at.least', 1)

            searchKeywords(keyword)
            // Wait for the search to finish re-rendering so the click isn't lost
            assertResultCount(viewport, '1')
            getVisibleResult(title).should('be.visible').click()

            cy.location('pathname').should('match', /^\/records\/(?!add$)[^/]+$/)
            cy.contains('h1', title).should('be.visible')
        })

        it('searches for a record by keywords', () => {
            const keyword = uniqueKeyword()
            const title = `${keyword} Cypress Record`

            createRecords([title, `${uniqueKeyword()} Cypress Other Record`])

            cy.visit('/records')
            searchKeywords(keyword)

            assertResultCount(viewport, '1')
            getVisibleResult(title).should('be.visible')
        })

        it('searches for a record by tags', () => {
            const keyword = uniqueKeyword()
            const rockRecord = `${keyword} Cypress Rock`
            const jazzRecord = `${keyword} Cypress Jazz`

            createRecords([rockRecord], { tags: { genres: [Genre.ROCK], colours: [] } })
            createRecords([jazzRecord], { tags: { genres: [Genre.JAZZ], colours: [] } })

            cy.visit(`/records?keywords=${keyword}`)
            assertResultCount(viewport, '2')

            openFilters(viewport)
            selectTag(Genre.JAZZ)
            applyFilters()

            cy.location('search').should('contain', 'tags=').and('contain', `keywords=${keyword}`)
            showResults(viewport)
            assertResultCount(viewport, '1')
            getVisibleResult(jazzRecord).should('be.visible')
            getVisibleResult(rockRecord).should('not.exist')
        })

        it('searches for a record by format', () => {
            const keyword = uniqueKeyword()
            const albumRecord = `${keyword} Cypress Album`
            const singleRecord = `${keyword} Cypress Single`

            createRecords([albumRecord], { format: RecordFormat.TWELVE_INCH })
            createRecords([singleRecord], { format: RecordFormat.SEVEN_INCH })

            cy.visit(`/records?keywords=${keyword}`)
            assertResultCount(viewport, '2')

            openFilters(viewport)
            selectTag(RecordFormat.SEVEN_INCH)
            applyFilters()

            cy.location('search').should('contain', 'filters=')
            showResults(viewport)
            assertResultCount(viewport, '1')
            getVisibleResult(singleRecord).should('be.visible')
            getVisibleResult(albumRecord).should('not.exist')
        })

        it('loads the next page and keeps it when going back from a record', () => {
            const keyword = uniqueKeyword()
            const titles = Array.from(
                { length: PAGE_SIZE + 2 },
                (_, index) => `${keyword} Cypress Paged ${index + 1}`,
            )

            createRecords(titles)

            cy.intercept({ method: 'POST', pathname: '/records' }).as('loadMore')
            cy.visit(`/records?keywords=${keyword}`)
            assertResultCount(viewport, `${PAGE_SIZE}+`)

            cy.contains('button:visible', /^Load More$/).click()
            cy.wait('@loadMore')

            assertResultCount(viewport, `${titles.length}`)
            cy.contains('button:visible', /^Load More$/).should('not.exist')

            // Open a record from the second page
            cy.get('h3:visible').last().click()
            cy.location('pathname').should('match', /^\/records\/(?!add$)[^/]+$/)

            cy.go('back')

            cy.location('search').should('contain', `keywords=${keyword}`)
            assertResultCount(viewport, `${titles.length}`)
            getVisibleResultTitles().should('have.length', titles.length)
        })
    })
})
