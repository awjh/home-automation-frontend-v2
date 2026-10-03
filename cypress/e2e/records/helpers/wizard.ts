export const clickWizardNext = () => {
    cy.contains('button', /^next$/i).click()
}

export const clickWizardFinish = () => {
    cy.contains('button', /^finish$/i).click()
}

// The wizard step heading, e.g. 'Add Record (2 of 5)'
export const waitForStep = (mode: 'Add' | 'Edit', step: number, stepCount: number) => {
    cy.contains(`${mode} Record (${step} of ${stepCount})`).should('be.visible')
}

export const getRecordIdFromRedirect = (): Cypress.Chainable<string> => {
    return cy
        .location('pathname', { timeout: 20000 })
        .should('match', /^\/records\/(?!add$)[^/]+$/)
        .then((pathname) => cy.wrap(pathname.split('/').pop()!))
}
