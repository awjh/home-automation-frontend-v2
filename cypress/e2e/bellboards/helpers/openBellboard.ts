// A click before hydration is dropped, so keep clicking the section until it opens
export function openBellboard(bellboardName: string, attemptsLeft = 5) {
    cy.contains('button', bellboardName).click()
    cy.contains('button', bellboardName).then(($trigger) => {
        if ($trigger.attr('aria-expanded') === 'true') {
            return
        }

        if (attemptsLeft <= 1) {
            throw new Error(`Bellboard ${bellboardName} did not open`)
        }

        cy.wait(500)
        openBellboard(bellboardName, attemptsLeft - 1)
    })
}
