import { MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import getMealItemSelector from '../selectors/getMealItemSelector'

export function assertMealVisible(date: string, mealTime: MealTime, text: string) {
    cy.get(getMealItemSelector(date, mealTime)).should('contain.text', text)
}
