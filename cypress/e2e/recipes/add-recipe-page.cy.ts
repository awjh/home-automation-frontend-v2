import { GetRecipeResponse } from '@awjh/home-automation-v2-api-models'
import { SourceType } from '@awjh/home-automation-v2-api-models/mealPlans'

describe('add recipe page', () => {
    const createdRecipeIds: string[] = []

    const clickWizardNext = () => {
        cy.contains('button', /^next$/i).click()
    }

    const setImageStepToNoImage = () => {
        cy.getInputByLabel(/would you like to add an image/i, 'select').select('no', {
            force: true,
        })
        clickWizardNext()
    }

    const acceptLookupSeededImage = () => {
        clickWizardNext()
    }

    const setImageStepToUpload = (filePath: string) => {
        cy.getInputByLabel(/would you like to add an image/i, 'select').select('yes', {
            force: true,
        })
        cy.getInputByLabel(/how would you like to provide the image/i, 'select').select('upload', {
            force: true,
        })
        cy.getInputByLabel(/image file/i, 'input').selectFile(filePath, { force: true })
        clickWizardNext()
    }

    const setIngredientRow = (
        rowIndex: number,
        values: {
            quantity?: string
            measure?: string
            item?: string
            preparation?: string
        },
    ) => {
        const baseIndex = rowIndex * 4

        if (values.quantity !== undefined) {
            cy.get('input[type="text"]').eq(baseIndex).clear().type(values.quantity)
        }

        if (values.measure !== undefined) {
            cy.get('input[type="text"]')
                .eq(baseIndex + 1)
                .clear()
                .type(values.measure)
        }

        if (values.item !== undefined) {
            cy.get('input[type="text"]')
                .eq(baseIndex + 2)
                .clear()
                .type(values.item)
        }

        if (values.preparation !== undefined) {
            cy.get('input[type="text"]')
                .eq(baseIndex + 3)
                .clear()
                .type(values.preparation)
        }
    }

    const clearMethodStepIngredients = (stepIndex: number) => {
        const popupTestId = `method-ingredients-popup-${stepIndex}`
        const deleteSelector = 'button[aria-label="delete method ingredient"]'

        const removeOne = () => {
            cy.getByTestId(popupTestId).then(($popup) => {
                const $buttons = $popup.find(deleteSelector)
                if ($buttons.length === 0) {
                    return
                }

                cy.wrap($buttons[0]).click()
                removeOne()
            })
        }

        removeOne()
    }

    const setMethodStepIngredients = (stepIndex: number, ingredientSourceKeys: string[]) => {
        const popupTestId = `method-ingredients-popup-${stepIndex}`

        cy.get('button[aria-label="edit method ingredients"]').eq(stepIndex).click()
        cy.getByTestId(popupTestId).should('be.visible')

        clearMethodStepIngredients(stepIndex)

        ingredientSourceKeys.forEach((sourceKey) => {
            cy.getByTestId(popupTestId)
                .find('select[aria-label="ingredient-draft"]')
                .select(sourceKey, { force: true })
        })

        cy.getByTestId(popupTestId).within(() => {
            cy.contains('button', /^save$/i).click()
        })

        cy.getByTestId(popupTestId).should('not.exist')
    }

    const getCreatedRecipeIdFromRedirect = (): Cypress.Chainable<string> => {
        return cy
            .location('pathname', { timeout: 20000 })
            .should('match', /^\/recipes\/(?!add$)[^/]+$/)
            .then((pathname) => {
                const recipeId = pathname.split('/').pop()

                if (!recipeId) {
                    throw new Error(`Unable to extract recipe id from path: ${pathname}`)
                }

                return cy.wrap(recipeId)
            })
    }

    const getRecipeById = (
        recipeId: string,
        retriesRemaining = 8,
    ): Cypress.Chainable<GetRecipeResponse> => {
        return cy
            .getCookie('stytch_session_jwt', { log: false })
            .then((sessionCookie) => {
                if (!sessionCookie?.value) {
                    throw new Error('Missing stytch_session_jwt cookie while fetching recipe by id')
                }

                return cy.request<GetRecipeResponse>({
                    method: 'GET',
                    url: `${Cypress.env('API_BASE_URL')}/recipes/${encodeURIComponent(recipeId)}`,
                    failOnStatusCode: false,
                    headers: {
                        Authorization: `Bearer ${sessionCookie.value}`,
                        'x-api-key': Cypress.env('API_KEY'),
                    },
                })
            })
            .then((response) => {
                if (response.status === 200) {
                    return cy.wrap(response.body)
                }

                if (retriesRemaining <= 0) {
                    throw new Error(
                        `Unable to fetch recipe after retries (id=${recipeId}, status=${response.status})`,
                    )
                }

                return cy
                    .wait(500, { log: false })
                    .then(() => getRecipeById(recipeId, retriesRemaining - 1))
            })
    }

    beforeEach(() => {
        cy.loginAsTestUser('/recipes/add')

        cy.searchRecipes('').then((recipes) => {
            recipes.forEach((recipe) => {
                createdRecipeIds.push(recipe.id)
            })
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

    afterEach(() => {
        cy.then(() => {
            createdRecipeIds.forEach((recipeId) => {
                cy.deleteRecipe(recipeId)
            })
        })

        cy.then(() => {
            createdRecipeIds.length = 0
        })
    })

    it('adds a book-sourced recipe, looks up calories, and persists expected server data', () => {
        const title = `Cypress Book Recipe ${Date.now()}`

        cy.visit('/recipes/add')

        cy.getInputByLabel(/where is the recipe originally from/i, 'select').select('book', {
            force: true,
        })
        cy.getInputByLabel(/book title/i, 'input').type('Cypress Book')
        cy.getInputByLabel(/page number/i, 'input').type('101')
        cy.getInputByLabel(/^series$/i, 'input').type('Test Series')
        clickWizardNext()

        cy.getInputByLabel(/recipe title/i, 'input').type(title)
        cy.getInputByLabel(/recipe author/i, 'input').type('Cypress Chef')
        cy.getInputByLabel(/cooking duration/i, 'input').type('35')
        cy.getInputByLabel(/preparation duration/i, 'input').type('15')
        cy.getInputByLabel(/standing time/i, 'input').type('5')
        cy.getInputByLabel(/serves/i, 'input').type('4')
        clickWizardNext()

        setImageStepToNoImage()

        setIngredientRow(0, {
            quantity: '500',
            measure: 'g',
            item: 'potatoes',
            preparation: 'peeled',
        })
        cy.get('input[type="text"]').eq(2).type('{enter}')
        clickWizardNext()

        cy.get('textarea').eq(0).type('Roast until tender{enter}')
        clickWizardNext()

        cy.contains('button', /lookup calories/i).click()
        cy.getInputByLabel(/calories/i, 'input').should('not.have.value', '0')
        clickWizardNext()

        cy.contains('button', /^italian$/i).click()
        cy.contains('button', /^finish$/i).click()

        getCreatedRecipeIdFromRedirect().then((recipeId) => {
            createdRecipeIds.push(recipeId)

            getRecipeById(recipeId).then((recipe) => {
                expect(recipe.title).to.equal(title)
                expect(recipe.originalSource).to.deep.equal({
                    type: SourceType.BOOK,
                    title: 'Cypress Book',
                    page: 101,
                    series: 'Test Series',
                })
                expect(recipe.calories).to.be.greaterThan(0)
                expect(recipe.tags.cuisine).to.deep.equal(['italian'])
                expect(recipe.ingredients[0].ingredients[0]).to.include({
                    item: 'potatoes',
                    quantity: 500,
                    measure: 'g',
                    preparation: 'peeled',
                })
                expect(recipe.image || null).to.equal(null)
            })
        })
    })

    it('adds an online recipe from lookup, amends extracted details, and persists expected server data', () => {
        const lookupUrl = 'https://www.bbc.co.uk/food/recipes/sticky_soy_and_ginger_45939'
        const title = `Sticky soy and ginger pork Cypress ${Date.now()}`

        cy.visit('/recipes/add')

        cy.getInputByLabel(/url/i, 'input').type(lookupUrl)
        cy.contains('button', /^extract$/i).click()

        cy.contains('button', /^next$/i).should('not.be.disabled')

        clickWizardNext()

        cy.getInputByLabel(/recipe title/i, 'input')
            .clear()
            .type(title)
        clickWizardNext()

        acceptLookupSeededImage()

        setIngredientRow(0, {
            quantity: '4',
            measure: 'cm',
            item: 'root ginger',
        })
        setIngredientRow(5, {
            quantity: '600',
            measure: 'g',
            preparation: 'trimmed',
        })

        cy.getByTestId('delete-button-0-9').click()
        clickWizardNext()

        setMethodStepIngredients(0, [
            'section-0-ingredient-0',
            'section-0-ingredient-1',
            'section-0-ingredient-2',
            'section-0-ingredient-3',
            'section-0-ingredient-4',
        ])
        setMethodStepIngredients(1, ['section-0-ingredient-5'])
        setMethodStepIngredients(3, [])
        setMethodStepIngredients(5, [])
        setMethodStepIngredients(6, ['section-0-ingredient-6', 'section-0-ingredient-8'])
        setMethodStepIngredients(7, ['section-0-ingredient-9'])

        clickWizardNext()

        cy.getInputByLabel(/calories/i, 'input')
            .clear()
            .type('700')
        clickWizardNext()

        cy.contains('button', /^finish$/i).click()

        getCreatedRecipeIdFromRedirect().then((recipeId) => {
            createdRecipeIds.push(recipeId)

            getRecipeById(recipeId).then((recipe) => {
                expect(recipe.originalSource).to.deep.equal({
                    type: SourceType.ONLINE,
                    url: lookupUrl,
                })
                expect(recipe.calories).to.equal(700)

                const ingredientZero = recipe.ingredients[0].ingredients[0]
                const ingredientFive = recipe.ingredients[0].ingredients[5]

                expect(ingredientZero.item).to.equal('root ginger')
                expect(ingredientZero.quantity).to.equal(4)
                expect(ingredientZero.measure).to.equal('cm')

                expect(ingredientFive.quantity).to.equal(600)
                expect(ingredientFive.measure).to.equal('g')
                expect(ingredientFive.preparation).to.equal('trimmed')

                expect(
                    recipe.ingredients[0].ingredients.some(
                        (ingredient) => ingredient.item === 'salt and pepper',
                    ),
                ).to.equal(false)

                expect(
                    recipe.method[0].ingredients.map((ingredient) => ingredient.item),
                ).to.deep.equal([
                    'root ginger',
                    'garlic cloves',
                    'soy sauce',
                    'chilli sauce',
                    'runny honey',
                ])

                expect(
                    recipe.method[1].ingredients.map((ingredient) => ingredient.item),
                ).to.deep.equal(['pork fillet'])

                expect(recipe.method[3].ingredients).to.have.length(0)
                expect(recipe.method[5].ingredients).to.have.length(0)

                expect(
                    recipe.method[6].ingredients.map((ingredient) => ingredient.item),
                ).to.deep.equal(['spring onions', 'coriander'])

                expect(
                    recipe.method[7].ingredients.map((ingredient) => ingredient.item),
                ).to.deep.equal(['noodles'])

                expect(typeof recipe.image).to.equal('string')
                expect((recipe.image as string).length).to.be.greaterThan(0)
            })
        })
    })

    it('uploads an image on a recipe and redirects to the new recipe page', () => {
        const title = `Cypress Upload Recipe ${Date.now()}`

        cy.visit('/recipes/add')

        cy.getInputByLabel(/where is the recipe originally from/i, 'select').select('book', {
            force: true,
        })
        cy.getInputByLabel(/book title/i, 'input').type('Cypress Book')
        cy.getInputByLabel(/page number/i, 'input').type('101')
        cy.getInputByLabel(/^series$/i, 'input').type('Test Series')
        clickWizardNext()

        cy.getInputByLabel(/recipe title/i, 'input').type(title)
        cy.getInputByLabel(/recipe author/i, 'input').type('Cypress Chef')
        cy.getInputByLabel(/cooking duration/i, 'input').type('35')
        cy.getInputByLabel(/preparation duration/i, 'input').type('15')
        cy.getInputByLabel(/standing time/i, 'input').type('5')
        cy.getInputByLabel(/serves/i, 'input').type('4')
        clickWizardNext()

        setImageStepToUpload('public/recipe.jpg')

        setIngredientRow(0, {
            quantity: '500',
            measure: 'g',
            item: 'potatoes',
            preparation: 'peeled',
        })
        cy.get('input[type="text"]').eq(2).type('{enter}')
        clickWizardNext()

        cy.get('textarea').eq(0).type('Roast until tender{enter}')
        clickWizardNext()

        cy.contains('button', /lookup calories/i).click()
        cy.getInputByLabel(/calories/i, 'input').should('not.have.value', '0')
        clickWizardNext()

        cy.contains('button', /^italian$/i).click()
        cy.contains('button', /^finish$/i).click()

        getCreatedRecipeIdFromRedirect().then((recipeId) => {
            createdRecipeIds.push(recipeId)

            getRecipeById(recipeId).then((recipe) => {
                expect(recipe.title).to.equal(title)
                expect(typeof recipe.image).to.equal('string')
                expect((recipe.image as string).length).to.be.greaterThan(0)
            })

            cy.get(`img[alt="${title}"]`).should('be.visible')
        })
    })
})
