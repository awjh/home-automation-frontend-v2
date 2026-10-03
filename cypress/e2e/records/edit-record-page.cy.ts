import { Colour, Genre } from '@awjh/home-automation-v2-api-models/records'
import {
    clickWizardFinish,
    clickWizardNext,
    getRecordIdFromRedirect,
    waitForStep,
} from './helpers/wizard'
import { buildRecord } from './recordBuilders/buildRecord'

// Editing keeps the existing artwork, so there is no image step
const EDIT_STEP_COUNT = 4

describe('edit record page', () => {
    beforeEach(() => {
        cy.loginAsTestUser('/records/add')
    })

    it('prefills the existing record and saves changes to the same record', () => {
        const originalTitle = `Cypress Edit Record ${Date.now()}`
        const editedTitle = `${originalTitle} Updated`
        const seed = buildRecord(originalTitle)

        cy.createRecord(seed).then((recordId) => {
            cy.visit(`/records/${recordId}/edit`)
            waitForStep('Edit', 1, EDIT_STEP_COUNT)

            cy.getInputByLabel(/catalogue number/i).should('have.value', seed.catNo)
            clickWizardNext()

            waitForStep('Edit', 2, EDIT_STEP_COUNT)
            cy.getInputByLabel(/^title/i)
                .should('have.value', originalTitle)
                .clear()
                .type(editedTitle)
            clickWizardNext()

            waitForStep('Edit', 3, EDIT_STEP_COUNT)
            cy.get('input')
                .filter((_, input) => (input as HTMLInputElement).value === 'Cypress Song A1')
                .should('have.length', 1)
            clickWizardNext()

            waitForStep('Edit', 4, EDIT_STEP_COUNT)
            cy.contains('button', /^blue$/i).click()
            clickWizardFinish()

            getRecordIdFromRedirect().should('eq', recordId)

            cy.getRecord(recordId).then((record) => {
                expect(record).to.deep.include({
                    ...seed,
                    id: recordId,
                    title: editedTitle,
                    tags: { genres: [Genre.ROCK], colours: [Colour.BLACK, Colour.BLUE] },
                })
            })
        })
    })
})
