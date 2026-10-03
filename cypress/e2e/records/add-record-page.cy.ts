import {
    Colour,
    Genre,
    RecordFormat,
    ReleaseType,
} from '@awjh/home-automation-v2-api-models/records'
import {
    clickWizardFinish,
    clickWizardNext,
    getRecordIdFromRedirect,
    waitForStep,
} from './helpers/wizard'

// Records can't be deleted through the API yet, so each test uses its own catalogue number

const ADD_STEP_COUNT = 5

const searchCatalogueNumber = (catNo: string) => {
    cy.getInputByLabel(/catalogue number/i)
        .clear()
        .type(catNo)
    cy.contains('button', /^search$/i).click()
}

const getExternalRecordOptions = () =>
    cy.get('[data-testid^="external-record-"]', { timeout: 30000 })

describe('add record page', () => {
    beforeEach(() => {
        cy.loginAsTestUser('/records/add')
        cy.visit('/records/add')
        waitForStep('Add', 1, ADD_STEP_COUNT)
    })

    it('fills in the record from a chosen MusicBrainz release and saves it', () => {
        // Rumours, which has many pressings on MusicBrainz
        searchCatalogueNumber('K 56344')

        getExternalRecordOptions().should('have.length.at.least', 1)
        cy.contains('Choose the pressing that matches your record.').should('be.visible')

        getExternalRecordOptions()
            .first()
            .within(() => {
                cy.contains('button', /^select$/i).click()
                cy.contains('button', /^selected$/i, { timeout: 30000 }).should('be.visible')
            })
        cy.contains('Record details filled in').should('be.visible')

        clickWizardNext()
        waitForStep('Add', 2, ADD_STEP_COUNT)

        cy.getInputByLabel(/^title/i)
            .invoke('val')
            .should('match', /rumours/i)
        cy.getInputByLabel(/^artist/i)
            .invoke('val')
            .should('match', /fleetwood mac/i)
        // MusicBrainz doesn't know the year of every pressing
        cy.getInputByLabel(/^year/i).then(($year) => {
            if (!$year.val()) {
                cy.wrap($year).type('1977')
            }
        })
        clickWizardNext()

        waitForStep('Add', 3, ADD_STEP_COUNT)
        // Cover art is filled in when the release has some. Kept in a variable rather than an
        // alias, as an alias re-runs its query when read and this step is gone by then
        let hasImage = false
        cy.getInputByLabel(/would you like to add an image/i, 'select').then(($hasImage) => {
            hasImage = $hasImage.val() === 'yes'
        })
        clickWizardNext()

        waitForStep('Add', 4, ADD_STEP_COUNT)
        cy.get('input')
            .filter((_, input) => (input as HTMLInputElement).value !== '')
            .should('have.length.at.least', 1)
        clickWizardNext()

        waitForStep('Add', 5, ADD_STEP_COUNT)
        clickWizardFinish()

        getRecordIdFromRedirect().then((recordId) => {
            cy.getRecord(recordId).then((record) => {
                expect(record.catNo).to.equal('K 56344')
                expect(record.title).to.match(/rumours/i)
                expect(record.artists.join(', ')).to.match(/fleetwood mac/i)
                expect(record.sides.flatMap((side) => side.songs)).to.have.length.at.least(1)

                if (hasImage) {
                    expect(record.image).to.be.a('string')
                }
            })
        })
    })

    it('lets the record be entered manually when nothing matches the catalogue number', () => {
        const catNo = `CYPRESS NO MATCH ${Date.now()}`
        const title = `Cypress Manual Record ${Date.now()}`

        searchCatalogueNumber(catNo)
        cy.contains('No record found', { timeout: 30000 }).should('be.visible')
        getExternalRecordOptions().should('not.exist')

        clickWizardNext()
        waitForStep('Add', 2, ADD_STEP_COUNT)

        cy.getInputByLabel(/^title/i).type(title)
        cy.getInputByLabel(/^artist/i).type('Cypress Artist')
        cy.getInputByLabel(/^label/i).type('Cypress Label')
        cy.getInputByLabel(/^year/i).type('2024')
        cy.getInputByLabel(/release type/i, 'select').select(ReleaseType.SINGLE, { force: true })
        cy.getInputByLabel(/format/i, 'select').select(RecordFormat.SEVEN_INCH, { force: true })
        clickWizardNext()

        waitForStep('Add', 3, ADD_STEP_COUNT)
        cy.getInputByLabel(/would you like to add an image/i, 'select').select('no', {
            force: true,
        })
        clickWizardNext()

        waitForStep('Add', 4, ADD_STEP_COUNT)
        cy.get('input[aria-label^="New track title" i]').first().type('Cypress Song')
        cy.get('input[aria-label^="New track duration" i]').first().type('3:05{enter}')
        cy.get('input')
            .filter((_, input) => (input as HTMLInputElement).value === 'Cypress Song')
            .should('have.length', 1)
        clickWizardNext()

        waitForStep('Add', 5, ADD_STEP_COUNT)
        cy.contains('button', /^pop$/i).click()
        cy.contains('button', /^red$/i).click()
        clickWizardFinish()

        getRecordIdFromRedirect().then((recordId) => {
            cy.getRecord(recordId).then((record) => {
                expect(record).to.deep.include({
                    catNo,
                    title,
                    artists: ['Cypress Artist'],
                    labels: ['Cypress Label'],
                    year: 2024,
                    type: ReleaseType.SINGLE,
                    format: RecordFormat.SEVEN_INCH,
                    sides: [{ name: 'A', songs: [{ title: 'Cypress Song', duration: 185 }] }],
                    tags: { genres: [Genre.POP], colours: [Colour.RED] },
                })
                expect(record).not.to.have.property('image')
            })
        })
    })
})
