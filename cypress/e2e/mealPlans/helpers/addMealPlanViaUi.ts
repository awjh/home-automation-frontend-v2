import type { PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { assertMealVisible } from './assertMealVisible'

function openAddMealModal(date: string) {
    cy.get(`[data-testid="add-meal-button"][data-date="${date}"]`)
        .contains('button', /add/i)
        .click()
    cy.getByTestId('add-meal-plan-modal')
        .should('be.visible')
        .and('have.attr', 'data-mode', 'add')
        .and('have.attr', 'data-date', date)
}

export default function addMealPlanViaUi(plan: PostMealPlanBody) {
    openAddMealModal(plan.date)

    cy.getByTestId('add-meal-plan-modal').within(() => {
        cy.getInputByLabel(/meal time/i, 'select').select(plan.mealTime, { force: true })
        cy.getInputByLabel(/source/i, 'select').select(plan.source.type, { force: true })
        cy.getInputByLabel(/course/i, 'select').select(plan.course, { force: true })
        cy.clickButtonByText('Next')

        switch (plan.source.type) {
            case SourceType.BOOK:
                cy.getInputByLabel(/title/i).clear().type(plan.title)
                cy.getInputByLabel(/author/i)
                    .clear()
                    .type(plan.author)
                cy.clickButtonByText('Next')
                cy.getInputByLabel(/book title/i)
                    .clear()
                    .type(plan.source.title)
                cy.getInputByLabel(/page number/i)
                    .clear()
                    .type(String(plan.source.page))
                if (plan.source.series) {
                    cy.getInputByLabel(/series/i)
                        .clear()
                        .type(plan.source.series)
                }
                cy.clickButtonByText('Next')
                break
            case SourceType.LEFTOVERS:
                cy.getInputByLabel(/title/i).clear().type(plan.title)
                cy.getInputByLabel(/author/i)
                    .clear()
                    .type(plan.author)
                cy.clickButtonByText('Next')
                cy.getInputByLabel(/original meal date/i)
                    .clear()
                    .type(plan.source.fromDate)
                cy.clickButtonByText('Next')
                break
            case SourceType.INTERNAL_RECIPE:
                cy.getInputByLabel(/search recipes/i)
                    .clear()
                    .type(plan.title)
                cy.clickButtonByText('Search')
                cy.contains(plan.title)
                    .closest('div')
                    .parent()
                    .within(() => {
                        cy.clickButtonByText('Select')
                    })
                cy.clickButtonByText('Submit')
                break
            case SourceType.MAGAZINE:
                cy.getInputByLabel(/title/i).clear().type(plan.title)
                cy.getInputByLabel(/author/i)
                    .clear()
                    .type(plan.author)
                cy.clickButtonByText('Next')
                cy.getInputByLabel(/magazine name/i)
                    .clear()
                    .type(plan.source.title)
                cy.getInputByLabel(/issue/i).clear().type(plan.source.issue)
                cy.getInputByLabel(/page/i).clear().type(String(plan.source.page))
                cy.clickButtonByText('Next')
                break
            case SourceType.FREEZER:
                cy.getInputByLabel(/title/i).clear().type(plan.title)
                cy.clickButtonByText('Next')
                break
            case SourceType.READY_PREPARED:
                cy.getInputByLabel(/title/i).clear().type(plan.title)
                cy.getInputByLabel(/producer/i)
                    .clear()
                    .type(plan.author)
                cy.clickButtonByText('Next')
                break
        }

        if (plan.source.type !== SourceType.INTERNAL_RECIPE) {
            cy.getInputByLabel(/preparation time/i)
                .clear()
                .type(String(plan.duration.prepDuration))
            cy.getInputByLabel(/cooking time/i)
                .clear()
                .type(String(plan.duration.cookingDuration))
            cy.getInputByLabel(/standing time/i)
                .clear()
                .type(String(plan.duration.standingTime))
            cy.clickButtonByText('Submit')
        }
    })

    cy.getByTestId('add-meal-plan-modal').should('not.exist')

    if (plan.source.type === SourceType.INTERNAL_RECIPE) {
        assertMealVisible(plan.date, plan.mealTime, plan.title)
        return
    }

    assertMealVisible(plan.date, plan.mealTime, plan.title)
}
