import type { GetMealPlansResponse, PostMealPlanBody } from '@awjh/home-automation-v2-api-models'
import { MealTime, SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'
import { assertMealVisible } from './assertMealVisible'

function openAddMealModal(date: string) {
    cy.get(`[data-testid="add-meal-button"][data-date="${date}"]`)
        .contains('button', /add/i)
        .click()
    cy.getByTestId('add-meal-plan-modal')
        .should('be.visible')
        .and('have.attr', 'data-mode', 'add')
        .and('have.attr', 'data-mealdate', date)
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

export function addBookMealPlanViaUiWithLeftoversFollowUp(
    mealPlan: PostMealPlanBody,
    leftoversDate: string,
    leftoversMealTime: MealTime = MealTime.LUNCH,
) {
    if (mealPlan.source.type !== SourceType.BOOK) {
        throw new Error('addBookMealPlanViaUiWithLeftoversFollowUp only supports book meals')
    }

    const bookSource = mealPlan.source

    openAddMealModal(mealPlan.date)

    cy.getByTestId('add-meal-plan-modal').within(() => {
        cy.getInputByLabel(/meal time/i, 'select').select(mealPlan.mealTime, { force: true })
        cy.getInputByLabel(/source/i, 'select').select(mealPlan.source.type, { force: true })
        cy.getInputByLabel(/course/i, 'select').select(mealPlan.course, { force: true })
        cy.getInputByLabel(/use for leftovers\?/i, 'select').select('true', { force: true })
        cy.getInputByLabel(/when will the leftovers be used\?/i)
            .clear()
            .type(leftoversDate)
            .should('have.value', leftoversDate)
        cy.clickButtonByText('Next')

        cy.getInputByLabel(/title/i).clear().type(mealPlan.title)
        cy.getInputByLabel(/author/i)
            .clear()
            .type(mealPlan.author)
        cy.clickButtonByText('Next')

        cy.getInputByLabel(/book title/i)
            .clear()
            .type(bookSource.title)
        cy.getInputByLabel(/page number/i)
            .clear()
            .type(String(bookSource.page))

        if (bookSource.series) {
            cy.getInputByLabel(/series/i)
                .clear()
                .type(bookSource.series)
        }

        cy.clickButtonByText('Next')

        cy.getInputByLabel(/preparation time/i)
            .clear()
            .type(String(mealPlan.duration.prepDuration))
        cy.getInputByLabel(/cooking time/i)
            .clear()
            .type(String(mealPlan.duration.cookingDuration))
        cy.getInputByLabel(/standing time/i)
            .clear()
            .type(String(mealPlan.duration.standingTime))
        cy.clickButtonByText('Submit')
    })

    assertMealVisible(mealPlan.date, mealPlan.mealTime, mealPlan.title)

    cy.getByTestId('add-meal-plan-modal')
        .should('be.visible')
        .and('have.attr', 'data-mealdate', leftoversDate)
        .within(() => {
            cy.getInputByLabel(/source/i, 'select')
                .should('be.disabled')
                .and('have.value', SourceType.LEFTOVERS)

            cy.getInputByLabel(/meal time/i, 'select').select(leftoversMealTime, { force: true })
            cy.clickButtonByText('Next')

            cy.getInputByLabel(/title/i).should('have.value', mealPlan.title)
            cy.getInputByLabel(/author/i).should('have.value', mealPlan.author)
            cy.clickButtonByText('Next')

            cy.getInputByLabel(/original meal date/i).should('have.value', mealPlan.date)
            cy.clickButtonByText('Next')

            cy.getInputByLabel(/preparation time/i).should(
                'have.value',
                String(mealPlan.duration.prepDuration),
            )
            cy.getInputByLabel(/cooking time/i).should(
                'have.value',
                String(mealPlan.duration.cookingDuration),
            )
            cy.getInputByLabel(/standing time/i).should(
                'have.value',
                String(mealPlan.duration.standingTime),
            )
            cy.clickButtonByText('Submit')
        })

    cy.getByTestId('add-meal-plan-modal').should('not.exist')

    assertMealVisible(leftoversDate, leftoversMealTime, mealPlan.title)

    cy.reload()

    assertMealVisible(mealPlan.date, mealPlan.mealTime, mealPlan.title)
    assertMealVisible(leftoversDate, leftoversMealTime, mealPlan.title)

    cy.getCookie('stytch_session_jwt', { log: false }).then((sessionCookie) => {
        cy.request<GetMealPlansResponse>({
            method: 'GET',
            url: `${Cypress.env('API_BASE_URL')}/meal-plans`,
            headers: {
                Authorization: `Bearer ${sessionCookie!.value}`,
                'x-api-key': Cypress.env('API_KEY'),
            },
            qs: {
                startDate: mealPlan.date,
                endDate: leftoversDate,
            },
        }).then(({ body }) => {
            expect(body).to.deep.include.members([
                mealPlan,
                {
                    author: mealPlan.author,
                    course: mealPlan.course,
                    date: leftoversDate,
                    mealTime: leftoversMealTime,
                    source: {
                        type: SourceType.LEFTOVERS,
                        fromDate: mealPlan.date,
                    },
                    title: mealPlan.title,
                    duration: mealPlan.duration,
                },
            ])
        })
    })
}
