import type { GetRecipesResponse } from '@awjh/home-automation-v2-api-models'

export default function waitForRecipeSearchResult(
    searchTerm: string,
    recipeTitle: string,
    remainingAttempts = 6,
): Cypress.Chainable<null> {
    const attempt = (attemptsRemaining: number): Cypress.Chainable<null> =>
        cy.searchRecipes(searchTerm).then((recipes: GetRecipesResponse) => {
            if (recipes.some((recipe) => recipe.title === recipeTitle)) {
                return cy.wrap(null, { log: false })
            }

            if (attemptsRemaining === 1) {
                throw new Error(
                    `Recipe ${recipeTitle} was not returned by search for ${searchTerm}`,
                )
            }

            return cy.wait(1000, { log: false }).then(() => attempt(attemptsRemaining - 1))
        })

    return attempt(remainingAttempts)
}
