import { MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import getMealItemSelector from '../selectors/getMealItemSelector'

export default function openEditMealModal(date: string, mealTime: MealTime) {
    cy.get(getMealItemSelector(date, mealTime))
        .first()
        .within(() => {
            cy.getByTestId('edit-meal-button').click()
        })

    cy.getByTestId('add-meal-plan-modal')
        .should('be.visible')
        .and('have.attr', 'data-mode', 'edit')
        .and('have.attr', 'data-date', date)
}
