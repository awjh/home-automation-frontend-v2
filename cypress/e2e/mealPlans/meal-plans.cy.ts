import { PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import { Course, MealTime } from '@awjh/home-automation-v2-api-models/mealPlans'
import createBookMealPlan from '@test/mockData/mealPlans/createBookMealPlan'
import createFreezerMealPlan from '@test/mockData/mealPlans/createFreezerMealPlan'
import createInternalRecipeMealPlan from '@test/mockData/mealPlans/createInternalRecipeMealPlan'
import createLeftoversMealPlan from '@test/mockData/mealPlans/createLeftoversMealPlan'
import createMagazineMealPlan from '@test/mockData/mealPlans/createMagazineMealPlan'
import createReadyPreparedMealPlan from '@test/mockData/mealPlans/createReadyPreparedMealPlan'
import { buildBookRecipe } from '../recipes/recipeBuilders/buildRecipe'
import addMealPlanViaUi, {
    addBookMealPlanViaUiWithLeftoversFollowUp,
} from './helpers/addMealPlanViaUi'
import { assertMealVisible } from './helpers/assertMealVisible'
import openEditMealModal from './helpers/openEditMealModal'
import waitForRecipeSearchResult from './helpers/waitForRecipeSearchResult'
import getMealDaySelector from './selectors/getMealDaySelector'
import getMealItemSelector from './selectors/getMealItemSelector'
import addDays from './utils/addDays'
import getWeekDates from './utils/getWeekDates'

describe('meal plans', () => {
    const createdRecipeIds: string[] = []

    beforeEach(() => {
        cy.loginAsTestUser()
        cy.clearAllMealPlans()
    })

    afterEach(() => {
        cy.getCookie('stytch_session_jwt', { log: false }).then((sessionCookie) => {
            if (!sessionCookie) {
                return
            }

            cy.clearAllMealPlans()
        })

        cy.then(() => {
            createdRecipeIds.forEach((recipeId) => {
                cy.deleteRecipe(recipeId)
            })
        })

        cy.then(() => {
            createdRecipeIds.length = 0
        })
    })

    it('adds meals across five days and shows them immediately after submit', () => {
        const weekDates = getWeekDates()
        const uniqueSeed = `cypressseed${Date.now()}`
        const internalRecipeTitle = `${uniqueSeed} pasta bake`
        let internalMealPlan: PostMealPlanBody

        cy.createRecipe(buildBookRecipe(internalRecipeTitle)).then((recipeId) => {
            createdRecipeIds.push(recipeId)
            internalMealPlan = createInternalRecipeMealPlan(
                weekDates[2],
                MealTime.LUNCH,
                internalRecipeTitle,
                recipeId,
            )
        })
        waitForRecipeSearchResult(uniqueSeed, internalRecipeTitle)

        cy.visitMealPlans()

        const originalMealPlanDate = weekDates[0]
        const originalMealPlanTime = MealTime.DINNER

        addMealPlanViaUi(
            createBookMealPlan(
                originalMealPlanDate,
                originalMealPlanTime,
                'Cypress Sunday Traybake',
            ),
        )
        addMealPlanViaUi(
            createLeftoversMealPlan(
                weekDates[1],
                MealTime.LUNCH,
                'Cypress Sunday Traybake',
                originalMealPlanDate,
                originalMealPlanTime,
                Course.MAIN,
            ),
        )
        addMealPlanViaUi(
            createReadyPreparedMealPlan(weekDates[1], MealTime.DINNER, 'Cypress Chicken Flatties'),
        )
        cy.then(() => {
            addMealPlanViaUi(internalMealPlan)
        })
        addMealPlanViaUi(
            createMagazineMealPlan(weekDates[3], MealTime.DINNER, 'Cypress Wellington'),
        )
        addMealPlanViaUi(
            createFreezerMealPlan(weekDates[4], MealTime.DINNER, 'Cypress Freezer Curry'),
        )

        cy.get('[data-testid="meal-plan-item"]').should('have.length', 6)
        cy.get(`${getMealDaySelector(weekDates[1])} [data-testid="meal-time-group"]`).should(
            'have.length',
            2,
        )
    })

    it('edits a couple of existing meals in the plan', () => {
        const weekDates = getWeekDates()

        cy.createMealPlan(createBookMealPlan(weekDates[0], MealTime.DINNER, 'Editable Traybake'))
        cy.createMealPlan(
            createReadyPreparedMealPlan(weekDates[2], MealTime.LUNCH, 'Editable Ravioli'),
        )

        cy.visitMealPlans()

        openEditMealModal(weekDates[0], MealTime.DINNER)
        cy.getByTestId('add-meal-plan-modal').within(() => {
            cy.clickButtonByText('Next')
            cy.getInputByLabel(/title/i).clear().type('Updated Traybake')
            cy.clickButtonByText('Next')
            cy.getInputByLabel(/book title/i)
                .clear()
                .type('The Quick Roasting Tin')
            cy.clickButtonByText('Next')
            cy.getInputByLabel(/preparation time/i)
                .clear()
                .type('12')
            cy.getInputByLabel(/cooking time/i)
                .clear()
                .type('35')
            cy.getInputByLabel(/standing time/i)
                .clear()
                .type('5')
            cy.clickButtonByText('Submit')
        })
        cy.getByTestId('add-meal-plan-modal').should('not.exist')
        assertMealVisible(weekDates[0], MealTime.DINNER, 'Updated Traybake')

        openEditMealModal(weekDates[2], MealTime.LUNCH)
        cy.getByTestId('add-meal-plan-modal').within(() => {
            cy.clickButtonByText('Next')
            cy.getInputByLabel(/title/i).clear().type('Updated Ravioli Bake')
            cy.getInputByLabel(/producer/i)
                .clear()
                .type('Waitrose')
            cy.clickButtonByText('Next')
            cy.getInputByLabel(/preparation time/i)
                .clear()
                .type('2')
            cy.getInputByLabel(/cooking time/i)
                .clear()
                .type('18')
            cy.getInputByLabel(/standing time/i)
                .clear()
                .type('1')
            cy.clickButtonByText('Submit')
        })
        cy.getByTestId('add-meal-plan-modal').should('not.exist')
        assertMealVisible(weekDates[2], MealTime.LUNCH, 'Updated Ravioli Bake')
    })

    it('reads meal plans after refresh and when switching to another week', () => {
        const weekDates = getWeekDates()
        const nextWeekDates = getWeekDates(addDays(new Date(), 7))

        cy.createMealPlan(
            createBookMealPlan(weekDates[0], MealTime.DINNER, 'Current Week Traybake'),
        )
        cy.createMealPlan(
            createReadyPreparedMealPlan(nextWeekDates[0], MealTime.LUNCH, 'Next Week Gnocchi'),
        )
        cy.createMealPlan(createBookMealPlan(nextWeekDates[1], MealTime.DINNER, 'Next Week Pie'))

        cy.visitMealPlans()

        cy.contains('Current Week Traybake').should('be.visible')
        cy.reload()
        cy.contains('Current Week Traybake').should('be.visible')

        cy.get(`[data-testid="calendar-day"][data-date="${nextWeekDates[0]}"]`).first().click()

        cy.contains('Next Week Gnocchi').should('be.visible')
        cy.contains('Next Week Pie').should('be.visible')
        cy.contains('Current Week Traybake').should('not.exist')
    })

    it('supports starter and main courses within the same meal time', () => {
        const weekDates = getWeekDates()

        cy.createMealPlan(
            createBookMealPlan(weekDates[0], MealTime.DINNER, 'Cypress Bruschetta', Course.STARTER),
        )
        cy.createMealPlan(
            createBookMealPlan(weekDates[0], MealTime.DINNER, 'Cypress Pasta Carbonara'),
        )

        cy.visitMealPlans()

        // Verify both courses are visible for the same meal time
        cy.get(getMealItemSelector(weekDates[0], MealTime.DINNER)).should('have.length', 2)
        cy.contains('Cypress Bruschetta').should('be.visible')
        cy.contains('Cypress Pasta Carbonara').should('be.visible')
    })

    it('opens a prefilled leftovers follow-up after adding a meal marked for leftovers', () => {
        const weekDates = getWeekDates()
        const mealDate = weekDates[0]
        const leftoversDate = weekDates[1]
        const mealPlan = createBookMealPlan(mealDate, MealTime.DINNER, 'Cypress Leftover Traybake')

        cy.visitMealPlans()

        addBookMealPlanViaUiWithLeftoversFollowUp(mealPlan, leftoversDate, MealTime.LUNCH)
    })
})
