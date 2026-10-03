import { buildRecord } from './recordBuilders/buildRecord'

// Records can't be deleted through the API yet, so each test uses its own title and catalogue number

describe('record page', () => {
    beforeEach(() => {
        cy.loginAsTestUser('/records/add')
    })

    it('shows the record details, tags and tracklist', () => {
        const title = `Cypress Record View ${Date.now()}`
        const record = buildRecord(title, {
            artists: ['Cypress Artist', 'Cypress Featured Artist'],
            sides: [
                {
                    name: 'A',
                    songs: [
                        { title: 'Cypress Song A1', duration: 185 },
                        { title: 'Cypress Song A2', duration: 254 },
                    ],
                },
                { name: 'B', songs: [{ title: 'Cypress Song B1', duration: 200 }] },
            ],
        })

        cy.createRecord(record).then((recordId) => {
            cy.visit(`/records/${recordId}`)

            cy.title().should('eq', `${title} - Cypress Artist, Cypress Featured Artist`)
            cy.contains('h1', title).should('be.visible')
            cy.contains('h2', 'Cypress Artist').should('contain.text', 'Cypress Featured Artist')
            cy.getByTestId('record-details').should(
                'have.text',
                `Cypress Label · ${record.catNo} · 2024`,
            )
            cy.contains('rock').should('be.visible')
            cy.contains('black').should('be.visible')

            cy.contains('Tracklist').should('be.visible')
            cy.contains('h3', 'Side A').should('be.visible')
            cy.contains('h3', 'Side B').should('be.visible')
            // Track numbers restart on each side
            cy.contains('1. Cypress Song A1').should('be.visible')
            cy.contains('2. Cypress Song A2').should('be.visible')
            cy.contains('1. Cypress Song B1').should('be.visible')
            cy.contains('03:05').should('be.visible')
            cy.contains('04:14').should('be.visible')
            cy.contains('03:20').should('be.visible')
        })
    })

    it('shows the record artwork', () => {
        const title = `Cypress Record Image ${Date.now()}`

        cy.createRecord(buildRecord(title, { image: '/recipe.jpg' })).then((recordId) => {
            cy.visit(`/records/${recordId}`)

            cy.get(`img[alt="${title}"]`)
                .should('be.visible')
                .and('have.attr', 'src')
                .and('include', 'recipe.jpg')
        })
    })

    it('shows a placeholder when the record has no artwork', () => {
        const title = `Cypress Record No Image ${Date.now()}`

        cy.createRecord(buildRecord(title)).then((recordId) => {
            cy.visit(`/records/${recordId}`)

            cy.contains('h1', title).should('be.visible')
            cy.get(`img[alt="${title}"]`).should('not.exist')
        })
    })
})
