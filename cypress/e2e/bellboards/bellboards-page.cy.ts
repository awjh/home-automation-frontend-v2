import { openBellboard } from './helpers/openBellboard'

// Seeded before the run by publishing cypress/fixtures/bellboards/hallwayboardStatus.json to the
// Cypress user's hallwayboard status topic
const BELLBOARD_NAME = 'hallwayboard'

type BellboardStatus = { rooms: string[] }

function getRoom(room: string, options?: Partial<Cypress.Timeoutable>) {
    return cy.get(`button[aria-label="Ring ${room}"]`, options)
}

function getInnerCircle(room: string, options?: Partial<Cypress.Timeoutable>) {
    return getRoom(room, options).find('[data-part="inner-circle"]', options)
}

describe('bellboards page', () => {
    beforeEach(() => {
        cy.loginAsTestUser('/bellboards')
        cy.waitForBellboard(BELLBOARD_NAME)
    })

    it('shows the bellboard collapsed and opens it to show its rooms', () => {
        cy.fixture<BellboardStatus>('bellboards/hallwayboardStatus').then(({ rooms }) => {
            cy.visit('/bellboards')

            cy.title().should('eq', 'Bellboards')
            cy.contains('button', BELLBOARD_NAME)
                .should('be.visible')
                .and('have.attr', 'aria-expanded', 'false')
            rooms.forEach((room) => getRoom(room).should('not.be.visible'))

            openBellboard(BELLBOARD_NAME)

            rooms.forEach((room) => {
                getRoom(room).should('be.visible').and('contain.text', room).and('be.enabled')
                getInnerCircle(room).should('not.have.attr', 'data-filled')
            })
        })
    })

    it('rings a room, showing it as rung for 30 seconds before it can be rung again', () => {
        cy.fixture<BellboardStatus>('bellboards/hallwayboardStatus').then(({ rooms }) => {
            const [room, otherRoom] = rooms

            cy.visit('/bellboards')
            openBellboard(BELLBOARD_NAME)

            getRoom(room).should('be.visible').click()

            // The inner circle only fills once the ring request has succeeded
            getInnerCircle(room).should('have.attr', 'data-filled')
            getRoom(room).should('be.disabled')
            getInnerCircle(otherRoom).should('not.have.attr', 'data-filled')
            getRoom(otherRoom).should('be.enabled')

            // Still rung shortly before the 30 seconds are up
            cy.wait(25000)
            getInnerCircle(room).should('have.attr', 'data-filled')
            getRoom(room).should('be.disabled')

            // Clears once the 30 seconds are up
            getInnerCircle(room, { timeout: 10000 }).should('not.have.attr', 'data-filled')
            getRoom(room).should('be.enabled')
        })
    })
})
